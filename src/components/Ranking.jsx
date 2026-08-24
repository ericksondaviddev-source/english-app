import { Trophy, Flame, Medal, Target, Clock } from 'lucide-react';
import { cn } from '../utils/cn';
import GlassCard from './base/GlassCard';
import IconBadge from './base/IconBadge';

const ACHIEVEMENTS = {
  first_sentence: { icon: Medal, name: "Primera frase", variant: "warning" },
  "10_correct": { icon: Target, name: "10 correctas", variant: "success" },
  speed_demon: { icon: Flame, name: "Speed Demon", variant: "error" },
  streak_7: { icon: Flame, name: "Streak 7", variant: "error" },
  streak_30: { icon: Flame, name: "Streak 30", variant: "error" },
  master_conjugator: { icon: Trophy, name: "Master Conjugator", variant: "primary" },
  slang_king: { icon: Trophy, name: "Slang King", variant: "primary" },
  perfect_pronunciation: { icon: Trophy, name: "Perfect Pronunciation", variant: "primary" },
  sentence_builder: { icon: Trophy, name: "Sentence Builder", variant: "primary" },
  combo_master: { icon: Trophy, name: "Combo Master", variant: "primary" },
  audio_exporter: { icon: Trophy, name: "Audio Exporter", variant: "primary" },
};

export default function Ranking({ gameState }) {
  const { points, level, streak, achievements, records, history } = gameState;
  const progressToNext = level.level < 8 
    ? ((points - level.required) / ([100, 300, 600, 1000, 1500, 2500, 5000][level.level - 1] || 1)) * 100
    : 100;

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-text animate-fade-in-down">Ranking</h1>

      <GlassCard className="animate-fade-in-up">
        <div className="flex items-center justify-between mb-3">
          <span className="font-bold text-primary flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            Nivel {level.level}
          </span>
          <span className="text-text-secondary text-sm">{level.name}</span>
        </div>
        <div className="h-3 bg-bg-secondary rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary to-primary-light rounded-full transition-all duration-500"
            style={{ width: `${Math.min(progressToNext, 100)}%` }}
          />
        </div>
        <p className="text-xs text-text-secondary mt-2">{points} / {level.required + 100} pts</p>
      </GlassCard>

      <div className="grid grid-cols-3 gap-3 stagger-children">
        <GlassCard className="text-center">
          <Flame className="w-6 h-6 text-error mx-auto mb-1" />
          <p className="text-2xl font-bold text-text">{streak}</p>
          <p className="text-xs text-text-secondary">Streak</p>
        </GlassCard>
        <GlassCard className="text-center">
          <Medal className="w-6 h-6 text-warning mx-auto mb-1" />
          <p className="text-2xl font-bold text-text">{achievements.length}</p>
          <p className="text-xs text-text-secondary">Logros</p>
        </GlassCard>
        <GlassCard className="text-center">
          <Target className="w-6 h-6 text-success mx-auto mb-1" />
          <p className="text-2xl font-bold text-text">{history.length}</p>
          <p className="text-xs text-text-secondary">Prácticas</p>
        </GlassCard>
      </div>

      <div className="animate-fade-in-up">
        <h2 className="font-bold text-text mb-3 flex items-center gap-2">
          <Medal className="w-5 h-5 text-warning" />
          Logros
        </h2>
        <div className="grid grid-cols-2 gap-3 stagger-children">
          {Object.entries(ACHIEVEMENTS).map(([id, ach]) => {
            const Icon = ach.icon;
            const isUnlocked = achievements.includes(id);
            return (
              <GlassCard
                key={id}
                className={cn(
                  "flex items-center gap-3",
                  !isUnlocked && "opacity-50"
                )}
              >
                <IconBadge icon={Icon} variant={isUnlocked ? ach.variant : "primary"} size="sm" />
                <span className="text-sm font-medium text-text">{ach.name}</span>
              </GlassCard>
            );
          })}
        </div>
      </div>

      <div className="animate-fade-in-up">
        <h2 className="font-bold text-text mb-3 flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" />
          Récords
        </h2>
        <GlassCard>
          {Object.entries(records).map(([mode, time]) => (
            <div key={mode} className="flex justify-between py-3 border-b border-border-light last:border-0">
              <span className="capitalize text-text font-medium">{mode}</span>
              <span className="font-mono text-text-secondary">
                {time ? `${time.toFixed(1)}s` : "—"}
              </span>
            </div>
          ))}
        </GlassCard>
      </div>
    </div>
  );
}