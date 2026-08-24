import { Star, Flame } from 'lucide-react';

export default function ScoreBar({ points, level, streak }) {
  return (
    <div className="glass border-b border-border-light px-6 py-4 flex items-center justify-between sticky top-0 z-40 animate-fade-in-down">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-warning/10 flex items-center justify-center">
          <Star className="w-4 h-4 text-warning fill-warning" />
        </div>
        <span className="font-mono font-bold text-text">{points}</span>
        <span className="text-xs text-text-secondary">pts</span>
      </div>
      
      <div className="flex items-center gap-2 bg-primary/10 px-4 py-1.5 rounded-full">
        <span className="text-sm font-bold text-primary">Nv.{level.level}</span>
        <span className="text-xs text-text-secondary">{level.name}</span>
      </div>

      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-error/10 flex items-center justify-center">
          <Flame className="w-4 h-4 text-error" />
        </div>
        <span className="font-mono font-bold text-text">{streak}</span>
      </div>
    </div>
  );
}
