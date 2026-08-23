import { signInAnonymously, updateProfile, onAuthStateChanged } from 'firebase/auth';
import { ref, set, get, update } from 'firebase/database';
import { auth, db } from '../config/firebase';

const DEFAULT_NAME = 'Jugador';

export function initAuth(callback) {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      try {
        const snapshot = await get(ref(db, `users/${user.uid}`));
        const userData = snapshot.val();
        callback({
          uid: user.uid,
          displayName: userData?.displayName || user.displayName || DEFAULT_NAME,
          points: userData?.points || 0,
          level: userData?.level || 1,
          stats: userData?.stats || { wins: 0, losses: 0, streak: 0, gamesPlayed: 0 }
        });
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        callback({
          uid: user.uid,
          displayName: user.displayName || DEFAULT_NAME,
          points: 0,
          level: 1,
          stats: { wins: 0, losses: 0, streak: 0, gamesPlayed: 0 }
        });
      }
    } else {
      callback(null);
    }
  });
}

export async function signInAnonymous(displayName) {
  let user;
  try {
    const result = await signInAnonymously(auth);
    user = result.user;
  } catch (error) {
    throw new Error('Anonymous sign-in failed: ' + error.message);
  }

  try {
    await updateProfile(user, { displayName });
  } catch (error) {
    console.error('Failed to update profile:', error);
  }

  try {
    await set(ref(db, `users/${user.uid}`), {
      displayName,
      points: 0,
      level: 1,
      stats: { wins: 0, losses: 0, streak: 0, gamesPlayed: 0 },
      createdAt: Date.now()
    });
  } catch (error) {
    console.error('Failed to create user record:', error);
    throw new Error('Account created but profile setup failed: ' + error.message);
  }

  return user;
}

export function getCurrentUser() {
  return auth.currentUser;
}

export async function updateUserData(uid, data) {
  try {
    await update(ref(db, `users/${uid}`), data);
  } catch (error) {
    console.error('Failed to update user data:', error);
    throw error;
  }
}

export async function getUserData(uid) {
  try {
    const snapshot = await get(ref(db, `users/${uid}`));
    return snapshot.val();
  } catch (error) {
    console.error('Failed to get user data:', error);
    return null;
  }
}