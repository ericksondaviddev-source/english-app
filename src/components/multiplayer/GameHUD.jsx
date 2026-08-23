import { Clock, Zap, Trophy, Target, AlertTriangle } from 'lucide-react';
import GlassCard from '../base/GlassCard';

export default function GameHUD({ 
  score, 
  progress, 
  timeLeft, 
  totalQuestions, 
  currentQuestion,
  streak = 0,
  showStreak = true 
}) {
  const progressPercent = totalQuestions > 0 ? (currentQuestion / totalQuestions) * 100 : 0;
  const isLowTime = timeLeft <= 10;
  
  return (
    <div className="flex flex-wrap gap-3 mb-6">
      {/* Score */}
      <GlassCard className="flex-1 min-w-[120px]">
        <div className="p-3 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--accent-primary)]/20 flex items-center justify-center">
            <Trophy className="w-5 h-5 text-[var(--accent-primary)]" />
          </div>
          <div>
            <p className="text-xs text-[var(--text-tertiary)]">Puntos</p>
            <p className="text-xl font-bold text-[var(--text-primary)]">{score}</p>
          </div>
        </div>
      </GlassCard>

      {/* Timer */}
      <GlassCard className={`flex-1 min-w-[120px] ${isLowTime ? 'ring-2 ring-red-500/50' : ''}`}>
        <div className="p-3 flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            isLowTime ? 'bg-red-500/20' : 'bg-yellow-500/20'
          }`}>
            {isLowTime ? (
              <AlertTriangle className="w-5 h-5 text-red-400 animate-pulse" />
            ) : (
              <Clock className="w-5 h-5 text-yellow-400" />
            )}
          </div>
          <div>
            <p className="text-xs text-[var(--text-tertiary)]">Tiempo</p>
            <p className={`text-xl font-bold font-mono ${
              isLowTime ? 'text-red-400' : 'text-[var(--text-primary)]'
            }`}>
              {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </p>
          </div>
        </div>
      </GlassCard>

      {/* Progress */}
      <GlassCard className="flex-1 min-w-[120px]">
        <div className="p-3 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--accent-secondary)]/20 flex items-center justify-center">
            <Target className="w-5 h-5 text-[var(--accent-secondary)]" />
          </div>
          <div>
            <p className="text-xs text-[var(--text-tertiary)]">Progreso</p>
            <p className="text-xl font-bold text-[var(--text-primary)]">
              {currentQuestion}/{totalQuestions}
            </p>
          </div>
        </div>
      </GlassCard>

      {/* Streak */}
      {showStreak && streak > 0 && (
        <GlassCard className="flex-1 min-w-[120px]">
          <div className="p-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
              <Zap className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <p className="text-xs text-[var(--text-tertiary)]">Racha</p>
              <p className="text-xl font-bold text-orange-400">x{streak}</p>
            </div>
          </div>
        </GlassCard>
      )}

      {/* Progress Bar */}
      <div className="w-full">
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
}
