import { useTimer } from '../hooks/useTimer';

export default function Timer({ onTimeUpdate, running: externalRunning }) {
  const { formatted, running, start, stop, reset } = useTimer();

  if (externalRunning && !running) start();
  if (!externalRunning && running) stop();

  return (
    <div className="flex items-center gap-3">
      <span className="font-mono text-2xl font-bold text-text">{formatted}</span>
      <button
        onClick={running ? stop : start}
        className="px-3 py-1 bg-primary/10 text-primary rounded-lg text-sm font-medium"
      >
        {running ? "⏸" : "▶"}
      </button>
      <button
        onClick={() => { reset(); onTimeUpdate?.(0); }}
        className="px-3 py-1 bg-bg-secondary text-text-secondary rounded-lg text-sm"
      >
        ↺
      </button>
    </div>
  );
}
