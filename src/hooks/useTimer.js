import { useState, useRef, useCallback } from 'react';

export function useTimer() {
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null);
  const startTimeRef = useRef(null);

  const start = useCallback(() => {
    if (running) return;
    startTimeRef.current = Date.now() - elapsed * 1000;
    setRunning(true);
    intervalRef.current = setInterval(() => {
      setElapsed((Date.now() - startTimeRef.current) / 1000);
    }, 100);
  }, [running, elapsed]);

  const stop = useCallback(() => {
    setRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);

  const reset = useCallback(() => {
    stop();
    setElapsed(0);
  }, [stop]);

  const formatted = (() => {
    const mins = Math.floor(elapsed / 60);
    const secs = Math.floor(elapsed % 60);
    const ms = Math.floor((elapsed % 1) * 10);
    return `${mins}:${secs.toString().padStart(2, "0")}.${ms}`;
  })();

  return { elapsed, running, formatted, start, stop, reset };
}
