import { signInAnonymously, updateProfile, onAuthStateChanged } from 'firebase/auth';
import { ref, set, get } from 'firebase/database';
import { auth, db } from '../config/firebase';

export function initAuth(callback) {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      const snapshot = await get(ref(db, `users/${user.uid}`));
      const userData = snapshot.val();
      callback({
        uid: user.uid,
        displayName: userData?.displayName || user.displayName || 'Jugador',
        points: userData?.points || 0,
        level: userData?.level || 1,
        stats: userData?.stats || { wins: 0, losses: 0, streak: 0, gamesPlayed: 0 }
      });
    } else {
      callback(null);
    }
  });
}

export async function signInAnonymous(displayName) {
  const { user } = await signInAnonymously(auth);
  await updateProfile(user, { displayName });
  await set(ref(db, `users/${user.uid}`), {
    displayName,
    points: 0,
    level: 1,
    stats: { wins: 0, losses: 0, streak: 0, gamesPlayed: 0 },
    createdAt: Date.now()
  });
  return user;
}

export function getCurrentUser() {
  return auth.currentUser;
}

export async function updateUserData(uid, data) {
  await set(ref(db, `users/${uid}`), data);
}

export async function getUserData(uid) {
  const snapshot = await get(ref(db, `users/${uid}`));
  return snapshot.val();
}