import { useState } from 'react';
import { Volume2, Sun, Moon, RotateCcw, AlertTriangle } from 'lucide-react';
import { cn } from '../utils/cn';
import GlassCard from './base/GlassCard';
import GradientButton from './base/GradientButton';
import { useSpeech } from '../hooks/useSpeech';

export default function Profile({ gameState, darkMode, setDarkMode }) {
  const [ttSpeed, setTtSpeed] = useState(1.0);
  const [confirmReset, setConfirmReset] = useState(false);
  const {
    voices, selectedVoice, changeVoice,
    spanishVoices, selectedSpanishVoice, changeSpanishVoice, speak
  } = useSpeech();

  const handleReset = () => {
    if (confirmReset) {
      gameState.resetProgress();
      setConfirmReset(false);
    } else {
      setConfirmReset(true);
      setTimeout(() => setConfirmReset(false), 3000);
    }
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-text animate-fade-in-down">Perfil</h1>

      <div className="space-y-4 stagger-children">
        {/* English Voice */}
        <GlassCard>
          <label className="font-medium text-text block mb-3 flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-primary" />
            Voz en inglés
          </label>
          <select
            value={selectedVoice}
            onChange={(e) => changeVoice(e.target.value)}
            className="w-full bg-bg-secondary border border-border rounded-xl px-4 py-3 text-text focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-smooth"
          >
            <option value="">Voz por defecto</option>
            {voices.map(v => (
              <option key={v.name} value={v.name}>{v.name} ({v.lang})</option>
            ))}
          </select>
          <GradientButton variant="ghost" className="w-full mt-3" onClick={() => speak("Hello, I'm your English teacher!", "en-US", ttSpeed)}>
            <div className="flex items-center justify-center gap-2">
              <Volume2 className="w-4 h-4" />
              <span>Probar voz inglesa</span>
            </div>
          </GradientButton>
        </GlassCard>

        {/* Spanish Voice */}
        <GlassCard>
          <label className="font-medium text-text block mb-3 flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-success" />
            Voz en español
          </label>
          <select
            value={selectedSpanishVoice}
            onChange={(e) => changeSpanishVoice(e.target.value)}
            className="w-full bg-bg-secondary border border-border rounded-xl px-4 py-3 text-text focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-smooth"
          >
            <option value="">Voz por defecto</option>
            {spanishVoices.map(v => (
              <option key={v.name} value={v.name}>{v.name} ({v.lang})</option>
            ))}
          </select>
          <GradientButton variant="ghost" className="w-full mt-3" onClick={() => speak("Hola, soy tu profesor de inglés!", "es-ES", ttSpeed)}>
            <div className="flex items-center justify-center gap-2">
              <Volume2 className="w-4 h-4" />
              <span>Probar voz española</span>
            </div>
          </GradientButton>
        </GlassCard>

        {/* TTS Speed */}
        <GlassCard>
          <label className="font-medium text-text block mb-3">
            Velocidad del TTS: <span className="text-primary font-bold">{ttSpeed}x</span>
          </label>
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={ttSpeed}
            onChange={(e) => setTtSpeed(parseFloat(e.target.value))}
            className="w-full accent-primary"
          />
          <div className="flex justify-between text-xs text-text-secondary mt-2">
            <span>Lento</span>
            <span>Normal</span>
            <span>Rápido</span>
          </div>
        </GlassCard>

        {/* Dark Mode */}
        <GlassCard className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {darkMode ? (
              <Moon className="w-5 h-5 text-primary" />
            ) : (
              <Sun className="w-5 h-5 text-warning" />
            )}
            <span className="font-medium text-text">Modo oscuro</span>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={cn(
              "w-14 h-7 rounded-full transition-smooth relative",
              darkMode ? "bg-primary" : "bg-border"
            )}
          >
            <div className={cn(
              "w-5 h-5 bg-bg rounded-full shadow-md absolute top-1 transition-smooth",
              darkMode ? "translate-x-8" : "translate-x-1"
            )} />
          </button>
        </GlassCard>

        {/* Reset */}
        <GradientButton
          variant={confirmReset ? "primary" : "ghost"}
          className={cn("w-full", confirmReset && "bg-error hover:bg-error/90")}
          onClick={handleReset}
        >
          <div className="flex items-center justify-center gap-2">
            {confirmReset ? (
              <>
                <AlertTriangle className="w-4 h-4" />
                <span>Confirmar reset</span>
              </>
            ) : (
              <>
                <RotateCcw className="w-4 h-4" />
                <span>Resetear progreso</span>
              </>
            )}
          </div>
        </GradientButton>
      </div>

      <div className="text-center text-xs text-text-secondary pt-8 animate-fade-in">
        <p className="font-medium">EnglishApp v1.0</p>
        <p>Aprende inglés de forma interactiva</p>
      </div>
    </div>
  );
}
