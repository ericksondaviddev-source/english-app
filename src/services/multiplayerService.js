import { ref, set, get, onValue, push, update, remove } from 'firebase/database';
import { db } from '../config/firebase';

export async function createRoom(hostId, hostName, mode, settings = {}) {
  const roomRef = push(ref(db, 'rooms'));
  const roomId = roomRef.key;

  const roomData = {
    id: roomId,
    mode,
    host: hostId,
    status: 'waiting',
    players: {
      [hostId]: {
        displayName: hostName,
        score: 0,
        progress: 0,
        status: 'ready',
        joinedAt: Date.now()
      }
    },
    settings: {
      maxPlayers: mode === 'duel' ? 2 : mode === 'battleRoyale' ? 8 : 6,
      timeLimit: settings.timeLimit || 120,
      questionCount: settings.questionCount || 10,
      ...settings
    },
    createdAt: Date.now(),
    startedAt: null,
    endedAt: null
  };

  await set(roomRef, roomData);
  return roomId;
}

export async function joinRoom(roomId, playerId, playerName) {
  const roomRef = ref(db, `rooms/${roomId}`);
  const snapshot = await get(roomRef);

  if (!snapshot.exists()) {
    throw new Error('Sala no encontrada');
  }

  const room = snapshot.val();

  if (room.status !== 'waiting') {
    throw new Error('La sala ya comenzó');
  }

  const playerCount = Object.keys(room.players).length;
  if (playerCount >= room.settings.maxPlayers) {
    throw new Error('Sala llena');
  }

  await update(ref(db, `rooms/${roomId}/players/${playerId}`), {
    displayName: playerName,
    score: 0,
    progress: 0,
    status: 'ready',
    joinedAt: Date.now()
  });

  return room;
}

export function subscribeToRoom(roomId, callback) {
  const roomRef = ref(db, `rooms/${roomId}`);
  return onValue(roomRef, (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.val());
    }
  });
}

export async function startGame(roomId, hostId) {
  const roomRef = ref(db, `rooms/${roomId}`);
  const snapshot = await get(roomRef);
  const room = snapshot.val();

  if (room.host !== hostId) {
    throw new Error('Solo el anfitrión puede iniciar');
  }

  await update(roomRef, {
    status: 'countdown',
    startedAt: Date.now()
  });

  setTimeout(async () => {
    await update(roomRef, { status: 'playing' });
  }, 3000);
}

export async function updateProgress(roomId, playerId, progress, score) {
  await update(ref(db, `rooms/${roomId}/players/${playerId}`), {
    progress,
    score,
    lastUpdate: Date.now()
  });
}

export async function endGame(roomId) {
  await update(ref(db, `rooms/${roomId}`), {
    status: 'finished',
    endedAt: Date.now()
  });
}

export async function leaveRoom(roomId, playerId) {
  await remove(ref(db, `rooms/${roomId}/players/${playerId}`));

  const roomRef = ref(db, `rooms/${roomId}`);
  const snapshot = await get(roomRef);
  if (snapshot.exists() && Object.keys(snapshot.val().players).length === 0) {
    await remove(roomRef);
  }
}

export async function deleteRoom(roomId) {
  await remove(ref(db, `rooms/${roomId}`));
}
