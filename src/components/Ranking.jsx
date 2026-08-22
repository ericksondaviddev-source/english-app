const ACHIEVEMENTS = {
  first_sentence: { icon: "🏅", name: "Primera frase" },
  "10_correct": { icon: "🏅", name: "10 correctas" },
  speed_demon: { icon: "⚡", name: "Speed Demon" },
  streak_7: { icon: "🔥", name: "Streak 7" },
  streak_30: { icon: "🔥", name: "Streak 30" },
  master_conjugator: { icon: "📚", name: "Master Conjugator" },
  slang_king: { icon: "👑", name: "Slang King" },
  perfect_pronunciation: { icon: "🎤", name: "Perfect Pronunciation" },
  sentence_builder: { icon: "🏗️", name: "Sentence Builder" },
  combo_master: { icon: "🔗", name: "Combo Master" },
  audio_exporter: { icon: "🎬", name: "Audio Exporter" },
};

export default function Ranking({ gameState }) {
  const { points, level, streak, achievements, records, history } = gameState;
  const progressToNext = level.level < 8 
    ? ((points - level.required) / ([100, 300, 600, 1000, 1500, 2500, 5000][level.level - 1] || 1)) * 100
    : 100;

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold text-text">Ranking</h1>

      <div className="bg-bg border border-border rounded-2xl p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="font-bold text-primary">Nivel {level.level}</span>
          <span className="text-text-secondary text-sm">{level.name}</span>
        </div>
        <div className="h-3 bg-bg-secondary rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary rounded-full transition-all"
            style={{ width: `${Math.min(progressToNext, 100)}%` }}
          />
        </div>
        <p className="text-xs text-text-secondary mt-2">{points} / {level.required + 100} pts</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="bg-bg-secondary rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-text">{streak}</p>
          <p className="text-xs text-text-secondary">Streak 🔥</p>
        </div>
        <div className="bg-bg-secondary rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-text">{achievements.length}</p>
          <p className="text-xs text-text-secondary">Logros 🏅</p>
        </div>
        <div className="bg-bg-secondary rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-text">{history.length}</p>
          <p className="text-xs text-text-secondary">Prácticas 📚</p>
        </div>
      </div>

      <div>
        <h2 className="font-bold text-text mb-3">Logros</h2>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(ACHIEVEMENTS).map(([id, ach]) => (
            <div
              key={id}
              className={`rounded-xl p-3 flex items-center gap-2 ${
                achievements.includes(id)
                  ? "bg-warning/10 border border-warning/20"
                  : "bg-bg-secondary border border-border opacity-50"
              }`}
            >
              <span className="text-2xl">{ach.icon}</span>
              <span className="text-sm font-medium text-text">{ach.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="font-bold text-text mb-3">Récords</h2>
        {Object.entries(records).map(([mode, time]) => (
          <div key={mode} className="flex justify-between py-2 border-b border-border">
            <span className="capitalize text-text">{mode}</span>
            <span className="font-mono text-text-secondary">
              {time ? `${time.toFixed(1)}s` : "—"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}