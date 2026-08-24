import { useState, useEffect, useCallback, useRef } from 'react';
import {
  createRoom as createRoomService,
  joinRoom as joinRoomService,
  subscribeToRoom,
  startGame as startGameService,
  updateProgress as updateProgressService,
  endGame as endGameService,
  leaveRoom as leaveRoomService,
  deleteRoom as deleteRoomService
} from '../services/multiplayerService';
import { getCurrentUser } from '../services/authService';

export function useMultiplayer(initialRoomId = null) {
  const [room, setRoom] = useState(null);
  const [roomId, setRoomId] = useState(initialRoomId);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const unsubscribeRef = useRef(null);

  useEffect(() => {
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, []);

  useEffect(() => {
    if (!roomId) {
      setRoom(null);
      return;
    }

    setLoading(true);
    unsubscribeRef.current = subscribeToRoom(roomId, (roomData) => {
      setRoom(roomData);
      setLoading(false);
    });

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, [roomId]);

  const createRoom = useCallback(async (mode, settings, playerName) => {
    const user = getCurrentUser();
    if (!user) throw new Error('No hay jugador. Ingresa tu nombre.');

    setError(null);
    try {
      const id = await createRoomService(user.uid, playerName || user.displayName, mode, settings);
      setRoomId(id);
      return id;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const joinRoom = useCallback(async (id, playerName) => {
    const user = getCurrentUser();
    if (!user) throw new Error('No hay jugador. Ingresa tu nombre.');

    setError(null);
    try {
      await joinRoomService(id, user.uid, playerName || user.displayName);
      setRoomId(id.toUpperCase());
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const startGame = useCallback(async () => {
    if (!roomId) throw new Error('No hay sala activa');
    setError(null);
    try {
      await startGameService(roomId, getCurrentUser()?.uid);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [roomId]);

  const updateProgress = useCallback(async (progress, score) => {
    const user = getCurrentUser();
    if (!user || !roomId) return;
    await updateProgressService(roomId, user.uid, progress, score);
  }, [roomId]);

  const endGame = useCallback(async () => {
    if (!roomId) return;
    await endGameService(roomId);
  }, [roomId]);

  const leaveRoom = useCallback(async () => {
    const user = getCurrentUser();
    if (!user || !roomId) {
      setRoomId(null);
      setRoom(null);
      return;
    }
    await leaveRoomService(roomId, user.uid);
    setRoomId(null);
    setRoom(null);
  }, [roomId]);

  const deleteRoom = useCallback(async () => {
    if (!roomId) return;
    await deleteRoomService(roomId);
    setRoomId(null);
    setRoom(null);
  }, [roomId]);

  return {
    room,
    roomId,
    error,
    loading,
    createRoom,
    joinRoom,
    startGame,
    updateProgress,
    endGame,
    leaveRoom,
    deleteRoom,
    isHost: Boolean(room?.host) && room?.host === getCurrentUser()?.uid
  };
}
