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

export function useMultiplayer() {
  const [room, setRoom] = useState(null);
  const [roomId, setRoomId] = useState(null);
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

  const createRoom = useCallback(async (mode, settings) => {
    const user = getCurrentUser();
    if (!user) throw new Error('No autenticado');

    setError(null);
    try {
      const id = await createRoomService(user.uid, user.displayName, mode, settings);
      setRoomId(id);
      return id;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const joinRoom = useCallback(async (id) => {
    const user = getCurrentUser();
    if (!user) throw new Error('No autenticado');

    setError(null);
    try {
      await joinRoomService(id, user.uid, user.displayName);
      setRoomId(id);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const startGame = useCallback(async () => {
    const user = getCurrentUser();
    if (!user || !roomId) throw new Error('No autenticado');

    setError(null);
    try {
      await startGameService(roomId, user.uid);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [roomId]);

  const updateProgress = useCallback(async (progress, score) => {
    const user = getCurrentUser();
    if (!user || !roomId) throw new Error('No autenticado');

    await updateProgressService(roomId, user.uid, progress, score);
  }, [roomId]);

  const endGame = useCallback(async () => {
    if (!roomId) throw new Error('No hay sala activa');
    await endGameService(roomId);
  }, [roomId]);

  const leaveRoom = useCallback(async () => {
    const user = getCurrentUser();
    if (!user || !roomId) return;

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
    isHost: room?.host === getCurrentUser()?.uid
  };
}
