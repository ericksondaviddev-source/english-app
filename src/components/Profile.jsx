import { useState } from 'react';
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
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold text-text">Perfil</h1>

      <div className="space-y-4">
        {/* English Voice */}
        <div className="bg-bg border border-border rounded-xl p-4">
          <label className="font-medium text-text block mb-2">
            🔊 Voz en inglés
          </label>
          <select
            value={selectedVoice}
            onChange={(e) => changeVoice(e.target.value)}
            className="w-full bg-bg-secondary border border-border rounded-lg px-3 py-2 text-text focus:outline-none focus:border-primary"
          >
            <option value="">Voz por defecto</option>
            {voices.map(v => (
              <option key={v.name} value={v.name}>{v.name} ({v.lang})</option>
            ))}
          </select>
          <button
            onClick={() => speak("Hello, I'm your English teacher!", "en-US", ttSpeed)}
            className="mt-2 text-sm text-primary hover:underline"
          >
            🔊 Probar voz inglesa
          </button>
        </div>

        {/* Spanish Voice */}
        <div className="bg-bg border border-border rounded-xl p-4">
          <label className="font-medium text-text block mb-2">
            🔊 Voz en español
          </label>
          <select
            value={selectedSpanishVoice}
            onChange={(e) => changeSpanishVoice(e.target.value)}
            className="w-full bg-bg-secondary border border-border rounded-lg px-3 py-2 text-text focus:outline-none focus:border-primary"
          >
            <option value="">Voz por defecto</option>
            {spanishVoices.map(v => (
              <option key={v.name} value={v.name}>{v.name} ({v.lang})</option>
            ))}
          </select>
          <button
            onClick={() => speak("Hola, soy tu profesor de inglés!", "es-ES", ttSpeed)}
            className="mt-2 text-sm text-primary hover:underline"
          >
            🔊 Probar voz española
          </button>
        </div>

        {/* TTS Speed */}
        <div className="bg-bg border border-border rounded-xl p-4">
          <label className="font-medium text-text block mb-2">
            Velocidad del TTS: {ttSpeed}x
          </label>
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={ttSpeed}
            onChange={(e) => setTtSpeed(parseFloat(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-text-secondary mt-1">
            <span>Lento</span>
            <span>Normal</span>
            <span>Rápido</span>
          </div>
        </div>

        {/* Dark Mode */}
        <div className="bg-bg border border-border rounded-xl p-4 flex items-center justify-between">
          <span className="font-medium text-text">Modo oscuro</span>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`w-12 h-6 rounded-full transition-colors ${
              darkMode ? "bg-primary" : "bg-border"
            }`}
          >
            <div className={`w-5 h-5 bg-bg rounded-full shadow transition-transform ${
              darkMode ? "translate-x-6" : "translate-x-0.5"
            }`} />
          </button>
        </div>

        {/* Reset */}
        <button
          onClick={handleReset}
          className={`w-full rounded-xl py-3 font-medium transition-colors ${
            confirmReset
              ? "bg-error text-white"
              : "bg-bg-secondary text-text-secondary border border-border"
          }`}
        >
          {confirmReset ? "⚠️ Confirmar reset" : "↺ Resetear progreso"}
        </button>
      </div>

      <div className="text-center text-xs text-text-secondary pt-8">
        <p>EnglishApp v1.0</p>
        <p>Aprende inglés de forma interactiva</p>
      </div>
    </div>
  );
}
