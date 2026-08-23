import { useState } from 'react';
import { Gamepad2, Swords, Users, Crown, Zap, Target, Trophy, Settings } from 'lucide-react';
import GlassCard from '../base/GlassCard';
import GradientButton from '../base/GradientButton';
import NameModal from './NameModal';
import { useMultiplayer } from '../../hooks/useMultiplayer';

const GAME_MODES = [
  {
    id: 'race',
    name: 'Carrera',
    icon: Zap,
    description: '¡Corre contra otros jugadores! Primero en completar gana.',
    color: 'text-yellow-400',
    players: '2-6 jugadores'
  },
  {
    id: 'duel',
    name: 'Duelo',
    icon: Swords,
    description: '1v1 cara a cara. Velocidad y precisión.',
    color: 'text-red-400',
    players: '2 jugadores'
  },
  {
    id: 'battleRoyale',
    name: 'Battle Royale',
    icon: Crown,
    description: '¡Último en pie! Eliminación progresiva.',
    color: 'text-purple-400',
    players: '2-8 jugadores'
  }
];

export default function MultiplayerMenu({ onBack, onStartGame }) {
  const [selectedMode, setSelectedMode] = useState(null);
  const [showNameModal, setShowNameModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [roomCode, setRoomCode] = useState('');
  const { createRoom, joinRoom, error } = useMultiplayer();

  const handleCreateRoom = async (playerName) => {
    if (!selectedMode) return;
    try {
      const roomId = await createRoom(selectedMode.id, { questionCount: 10, timeLimit: 120 });
      onStartGame(roomId, selectedMode.id);
    } catch (err) {
      console.error('Error creating room:', err);
    }
  };

  const handleJoinRoom = async (playerName) => {
    if (!roomCode.trim()) return;
    try {
      await joinRoom(roomCode.trim());
      onStartGame(roomCode.trim(), 'race'); // Mode will be updated from room data
    } catch (err) {
      console.error('Error joining room:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--bg-primary)] via-[var(--bg-secondary)] to-[var(--bg-tertiary)] p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={onBack}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <span className="text-[var(--text-secondary)]">? Volver</span>
          </button>
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold gradient-text flex items-center gap-3">
              <Gamepad2 className="text-[var(--accent-primary)]" />
              Multijugador
            </h1>
            <p className="text-[var(--text-secondary)] mt-1">Competir hace el aprendizaje más divertido</p>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400">
            {error}
          </div>
        )}

        {/* Game Modes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-8">
          {GAME_MODES.map((mode) => {
            const Icon = mode.icon;
            return (
              <GlassCard
                key={mode.id}
                className={`cursor-pointer transition-all duration-300 ${
                  selectedMode?.id === mode.id
                    ? 'ring-2 ring-[var(--accent-primary)] bg-white/10'
                    : 'hover:bg-white/5'
                }`}
                onClick={() => setSelectedMode(mode)}
              >
                <div className="p-6 text-center">
                  <Icon className={`w-12 h-12 mx-auto mb-4 ${mode.color}`} />
                  <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">
                    {mode.name}
                  </h3>
                  <p className="text-sm text-[var(--text-secondary)] mb-3">
                    {mode.description}
                  </p>
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/10 text-xs text-[var(--text-secondary)]">
                    <Users className="w-3 h-3" />
                    {mode.players}
                  </span>
                </div>
              </GlassCard>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <GradientButton
            onClick={() => setShowNameModal(true)}
            disabled={!selectedMode}
            className="flex items-center gap-2"
          >
            <Crown className="w-5 h-5" />
            Crear Sala
          </GradientButton>

          <GradientButton
            onClick={() => setShowJoinModal(true)}
            variant="secondary"
            className="flex items-center gap-2"
          >
            <Target className="w-5 h-5" />
            Unirse con Código
          </GradientButton>
        </div>

        {/* Tips */}
        <GlassCard className="mt-8">
          <div className="p-4">
            <h3 className="font-semibold text-[var(--text-primary)] mb-3 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-400" />
              Consejos para Competir
            </h3>
            <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
              <li>• Practica los modos individuales primero</li>
              <li>• La velocidad importa, pero la precisión es clave</li>
              <li>• En Battle Royale, ¡no te quedes sin vidas!</li>
              <li>• Comparte el código de sala con amigos</li>
            </ul>
          </div>
        </GlassCard>
      </div>

      {/* Modals */}
      {showNameModal && (
        <NameModal
          title="Crear Sala"
          buttonText="Crear Sala"
          onSubmit={handleCreateRoom}
          onClose={() => setShowNameModal(false)}
        />
      )}

      {showJoinModal && (
        <NameModal
          title="Unirse a Sala"
          buttonText="Unirse"
          showRoomCode
          roomCode={roomCode}
          onRoomCodeChange={setRoomCode}
          onSubmit={handleJoinRoom}
          onClose={() => setShowJoinModal(false)}
        />
      )}
    </div>
  );
}
