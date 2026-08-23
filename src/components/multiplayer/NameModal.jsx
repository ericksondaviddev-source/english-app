import { useState } from 'react';
import { X, User, Hash } from 'lucide-react';
import GradientButton from '../base/GradientButton';

export default function NameModal({ 
  title, 
  buttonText, 
  onSubmit, 
  onClose,
  showRoomCode = false,
  roomCode = '',
  onRoomCodeChange
}) {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    setLoading(true);
    try {
      await onSubmit(name.trim());
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="glass-strong rounded-2xl p-6 w-full max-w-md animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-[var(--text-primary)]">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5 text-[var(--text-secondary)]" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
              Tu Nombre de Jugador
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-tertiary)]" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Escribe tu nombre..."
                maxLength={20}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] transition-all"
                autoFocus
              />
            </div>
            <p className="mt-1 text-xs text-[var(--text-tertiary)]">
              {name.length}/20 caracteres
            </p>
          </div>

          {showRoomCode && (
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                Código de Sala
              </label>
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-tertiary)]" />
                <input
                  type="text"
                  value={roomCode}
                  onChange={(e) => onRoomCodeChange?.(e.target.value)}
                  placeholder="Ej: ABC123"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] transition-all font-mono"
                  autoFocus
                />
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-white/10 text-[var(--text-secondary)] hover:bg-white/5 transition-colors"
            >
              Cancelar
            </button>
            <GradientButton
              type="submit"
              disabled={!name.trim() || loading}
              className="flex-1"
            >
              {loading ? 'Conectando...' : buttonText}
            </GradientButton>
          </div>
        </form>
      </div>
    </div>
  );
}
