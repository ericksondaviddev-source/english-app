import { useEffect, useRef } from 'react';

const ACHIEVEMENTS = {
  first_sentence: { icon: "🏅", name: "Primera frase", desc: "Construiste tu primera oración" },
  "10_correct": { icon: "🏅", name: "10 correctas", desc: "10 respuestas correctas seguidas" },
  speed_demon: { icon: "⚡", name: "Speed Demon", desc: "Modo competitivo en menos de 15s" },
  streak_7: { icon: "🔥", name: "Streak 7", desc: "7 días consecutivos" },
  streak_30: { icon: "🔥", name: "Streak 30", desc: "30 días consecutivos" },
  master_conjugator: { icon: "📚", name: "Master Conjugator", desc: "Usaste 20 verbos diferentes" },
  slang_king: { icon: "👑", name: "Slang King", desc: "10 expresiones informales correctas" },
  perfect_pronunciation: { icon: "🎤", name: "Perfect Pronunciation", desc: "10 trucos de pronunciación correctos" },
  sentence_builder: { icon: "🏗️", name: "Sentence Builder", desc: "50 frases construidas" },
  combo_master: { icon: "🔗", name: "Combo Master", desc: "5 combinaciones perfectas" },
  audio_exporter: { icon: "🎬", name: "Audio Exporter", desc: "Descargaste tu primer MP4" },
};

export default function AchievementToast({ achievementId, onDismiss }) {
  const achievement = ACHIEVEMENTS[achievementId];
  const timerRef = useRef(null);

  useEffect(() => {
    if (achievementId) {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        onDismiss?.();
      }, 3000);
      return () => clearTimeout(timerRef.current);
    }
  }, [achievementId, onDismiss]);

  if (!achievement) return null;

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-bounce">
      <div className="bg-bg border border-warning rounded-2xl px-6 py-4 shadow-lg flex items-center gap-3">
        <span className="text-3xl">{achievement.icon}</span>
        <div>
          <p className="font-bold text-text">{achievement.name}</p>
          <p className="text-sm text-text-secondary">{achievement.desc}</p>
        </div>
      </div>
    </div>
  );
}
