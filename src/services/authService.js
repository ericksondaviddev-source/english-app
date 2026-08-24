// Local identity — no backend needed. Each player gets a persistent random ID.
const STORAGE_KEY = 'eng_mp_user';

const DEFAULT_STATS = { wins: 0, losses: 0, streak: 0, gamesPlayed: 0 };

function randomId() {
  return 'uid-' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

export function initAuth(callback) {
  // No backend: resolve immediately with the stored user (or null)
  callback(getCurrentUser());
  return () => {};
}

export async function signInAnonymous(displayName) {
  const existing = getCurrentUser();
  if (existing) {
    // Idempotent: just refresh the name if provided
    if (displayName && displayName !== existing.displayName) {
      const updated = { ...existing, displayName };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    }
    return existing;
  }

  const user = {
    uid: randomId(),
    displayName: displayName || 'Jugador',
    points: 0,
    level: 1,
    stats: { ...DEFAULT_STATS },
    createdAt: Date.now()
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  return user;
}

export function getCurrentUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export async function updateUserData(uid, data) {
  const user = getCurrentUser();
  if (!user || user.uid !== uid) return;
  const updated = { ...user, ...data };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export async function getUserData(uid) {
  const user = getCurrentUser();
  return user && user.uid === uid ? user : null;
}
