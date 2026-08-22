export default function ScoreBar({ points, level, streak }) {
  return (
    <div className="bg-bg border-b border-border px-4 py-3 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-2">
        <span className="text-warning text-lg">⭐</span>
        <span className="font-mono font-semibold text-text">{points} pts</span>
      </div>
      
      <div className="flex items-center gap-2 bg-bg-secondary px-3 py-1 rounded-full">
        <span className="text-sm font-medium text-primary">Nv.{level.level}</span>
        <span className="text-xs text-text-secondary">{level.name}</span>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-lg">🔥</span>
        <span className="font-mono font-semibold text-text">{streak}</span>
      </div>
    </div>
  );
}
