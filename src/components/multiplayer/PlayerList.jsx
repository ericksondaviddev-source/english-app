import { Crown, User, Wifi, WifiOff } from 'lucide-react';

export default function PlayerList({ players, hostId, currentUserId }) {
  const playerEntries = Object.entries(players || {});
  
  return (
    <div className="space-y-2">
      {playerEntries.map(([uid, player]) => {
        const isHost = uid === hostId;
        const isCurrent = uid === currentUserId;
        
        return (
          <div
            key={uid}
            className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
              isCurrent
                ? 'bg-[var(--accent-primary)]/20 border border-[var(--accent-primary)]/30'
                : 'bg-white/5 border border-white/10'
            }`}
          >
            {/* Avatar */}
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              isHost ? 'bg-yellow-500/20' : 'bg-white/10'
            }`}>
              {isHost ? (
                <Crown className="w-5 h-5 text-yellow-400" />
              ) : (
                <User className="w-5 h-5 text-[var(--text-secondary)]" />
              )}
            </div>
            
            {/* Name & Status */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className={`font-medium truncate ${
                  isCurrent ? 'text-[var(--accent-primary)]' : 'text-[var(--text-primary)]'
                }`}>
                  {player.displayName}
                </span>
                {isHost && (
                  <span className="px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 text-xs">
                    Anfitrión
                  </span>
                )}
                {isCurrent && (
                  <span className="px-2 py-0.5 rounded-full bg-[var(--accent-primary)]/20 text-[var(--accent-primary)] text-xs">
                    Tú
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs text-[var(--text-tertiary)]">
                  {player.score || 0} puntos
                </span>
                {player.status === 'ready' && (
                  <span className="text-xs text-green-400">● Listo</span>
                )}
              </div>
            </div>
            
            {/* Connection indicator */}
            <div className="flex items-center gap-1">
              {player.connected !== false ? (
                <Wifi className="w-4 h-4 text-green-400" />
              ) : (
                <WifiOff className="w-4 h-4 text-red-400" />
              )}
            </div>
          </div>
        );
      })}
      
      {playerEntries.length === 0 && (
        <div className="text-center py-8 text-[var(--text-tertiary)]">
          <User className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>Esperando jugadores...</p>
        </div>
      )}
    </div>
  );
}
