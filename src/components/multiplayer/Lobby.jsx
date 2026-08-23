import { useState } from 'react';
import { Copy, Check, Play, Users, Settings, Clock, Hash } from 'lucide-react';
import GlassCard from '../base/GlassCard';
import GradientButton from '../base/GradientButton';
import PlayerList from './PlayerList';
import { useMultiplayer } from '../../hooks/useMultiplayer';
import { getCurrentUser } from '../../services/authService';

export default function Lobby({ onStartGame, onBack }) {
  const { room, roomId, startGame, isHost, loading } = useMultiplayer();
  const [copied, setCopied] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const currentUserId = getCurrentUser()?.uid;

  const handleCopyCode = async () => {
    if (!roomId) return;
    await navigator.clipboard.writeText(roomId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleStartGame = async () => {
    try {
      await startGame();
      onStartGame(roomId, room.mode);
    } catch (err) {
      console.error('Error starting game:', err);
    }
  };

  if (!room) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[var(--bg-primary)] via-[var(--bg-secondary)] to-[var(--bg-tertiary)] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[var(--accent-primary)] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[var(--text-secondary)]">Conectando a la sala...</p>
        </div>
      </div>
    );
  }

  const playerCount = Object.keys(room.players || {}).length;
  const maxPlayers = room.settings?.maxPlayers || 6;
  const canStart = isHost && playerCount >= 2;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--bg-primary)] via-[var(--bg-secondary)] to-[var(--bg-tertiary)] p-4 sm:p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={onBack}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <span className="text-[var(--text-secondary)]">← Volver</span>
          </button>
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
              Sala de Espera
            </h1>
            <p className="text-[var(--text-secondary)] text-sm">
              Modo: {room.mode === 'race' ? 'Carrera' : room.mode === 'duel' ? 'Duelo' : 'Battle Royale'}
            </p>
          </div>
        </div>

        {/* Room Code Card */}
        <GlassCard className="mb-6">
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[var(--text-secondary)] mb-1">Código de Sala</p>
                <div className="flex items-center gap-2">
                  <Hash className="w-5 h-5 text-[var(--accent-primary)]" />
                  <span className="text-2xl font-mono font-bold text-[var(--text-primary)] tracking-wider">
                    {roomId}
                  </span>
                </div>
              </div>
              <button
                onClick={handleCopyCode}
                className="p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
              >
                {copied ? (
                  <Check className="w-5 h-5 text-green-400" />
                ) : (
                  <Copy className="w-5 h-5 text-[var(--text-secondary)]" />
                )}
              </button>
            </div>
            <p className="mt-2 text-xs text-[var(--text-tertiary)]">
              Comparte este código con tus amigos para que se unan
            </p>
          </div>
        </GlassCard>

        {/* Players Card */}
        <GlassCard className="mb-6">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-[var(--text-primary)] flex items-center gap-2">
                <Users className="w-5 h-5 text-[var(--accent-primary)]" />
                Jugadores ({playerCount}/{maxPlayers})
              </h3>
              {room.status === 'waiting' && (
                <span className="px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-400 text-xs animate-pulse">
                  Esperando...
                </span>
              )}
            </div>
            <PlayerList 
              players={room.players} 
              hostId={room.host}
              currentUserId={currentUserId}
            />
          </div>
        </GlassCard>

        {/* Game Settings */}
        <GlassCard className="mb-6">
          <div className="p-4">
            <h3 className="font-semibold text-[var(--text-primary)] mb-3 flex items-center gap-2">
              <Settings className="w-5 h-5 text-[var(--accent-secondary)]" />
              Configuración
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[var(--text-tertiary)]" />
                <span className="text-[var(--text-secondary)]">Tiempo:</span>
                <span className="text-[var(--text-primary)]">{room.settings?.timeLimit || 120}s</span>
              </div>
              <div className="flex items-center gap-2">
                <Hash className="w-4 h-4 text-[var(--text-tertiary)]" />
                <span className="text-[var(--text-secondary)]">Preguntas:</span>
                <span className="text-[var(--text-primary)]">{room.settings?.questionCount || 10}</span>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Start Button (Host Only) */}
        {isHost && (
          <div className="flex justify-center">
            <GradientButton
              onClick={handleStartGame}
              disabled={!canStart || loading}
              className="flex items-center gap-2 text-lg px-8 py-4"
            >
              <Play className="w-6 h-6" />
              {loading ? 'Iniciando...' : 'Iniciar Partida'}
            </GradientButton>
          </div>
        )}

        {/* Waiting message for non-hosts */}
        {!isHost && (
          <div className="text-center py-4">
            <p className="text-[var(--text-secondary)]">
              Esperando que el anfitrión inicie la partida...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
