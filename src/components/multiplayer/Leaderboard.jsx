import { Trophy, Medal, Crown, Star, TrendingUp, Users } from 'lucide-react';
import GlassCard from '../base/GlassCard';

export default function Leaderboard({ players, currentUserId, showDetails = true }) {
  const sortedPlayers = Object.entries(players || {})
    .map(([uid, data]) => ({ uid, ...data }))
    .sort((a, b) => (b.score || 0) - (a.score || 0));

  const getRankIcon = (index) => {
    switch (index) {
      case 0:
        return <Crown className="w-6 h-6 text-yellow-400" />;
      case 1:
        return <Medal className="w-6 h-6 text-gray-300" />;
      case 2:
        return <Medal className="w-6 h-6 text-amber-600" />;
      default:
        return <span className="w-6 h-6 flex items-center justify-center text-[var(--text-tertiary)]">{index + 1}</span>;
    }
  };

  const getRankBg = (index) => {
    switch (index) {
      case 0:
        return 'bg-yellow-500/10 border-yellow-500/30';
      case 1:
        return 'bg-gray-500/10 border-gray-500/30';
      case 2:
        return 'bg-amber-500/10 border-amber-500/30';
      default:
        return 'bg-white/5 border-white/10';
    }
  };

  return (
    <GlassCard>
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-[var(--text-primary)] flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-400" />
            Clasificación
          </h3>
          <span className="text-sm text-[var(--text-tertiary)]">
            {sortedPlayers.length} jugadores
          </span>
        </div>

        <div className="space-y-2">
          {sortedPlayers.map((player, index) => (
            <div
              key={player.uid}
              className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                player.uid === currentUserId
                  ? 'bg-[var(--accent-primary)]/20 border-[var(--accent-primary)]/30'
                  : getRankBg(index)
              }`}
            >
              {/* Rank */}
              <div className="w-8 flex justify-center">
                {getRankIcon(index)}
              </div>

              {/* Avatar */}
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                index === 0 ? 'bg-yellow-500/20' : 'bg-white/10'
              }`}>
                <Users className="w-5 h-5 text-[var(--text-secondary)]" />
              </div>

              {/* Name & Stats */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`font-medium truncate ${
                    player.uid === currentUserId ? 'text-[var(--accent-primary)]' : 'text-[var(--text-primary)]'
                  }`}>
                    {player.displayName}
                  </span>
                  {player.uid === currentUserId && (
                    <span className="px-2 py-0.5 rounded-full bg-[var(--accent-primary)]/20 text-[var(--accent-primary)] text-xs">
                      Tú
                    </span>
                  )}
                </div>
                {showDetails && (
                  <div className="flex items-center gap-3 mt-0.5 text-xs text-[var(--text-tertiary)]">
                    <span className="flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      {player.wins || 0} victorias
                    </span>
                    <span className="flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      {player.level || 1}
                    </span>
                  </div>
                )}
              </div>

              {/* Score */}
              <div className="text-right">
                <p className="text-lg font-bold text-[var(--accent-primary)]">{player.score || 0}</p>
                <p className="text-xs text-[var(--text-tertiary)]">puntos</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </GlassCard>
  );
}
