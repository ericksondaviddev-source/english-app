const MODES = [
  { id: "construction", icon: "🧱", name: "Construcción", desc: "Arma frases seleccionando bloques", color: "bg-primary/10 border-primary/20" },
  { id: "mutation", icon: "🔄", name: "Mutación", desc: "Transforma frases entre modos", color: "bg-success/10 border-success/20" },
  { id: "combination", icon: "🔗", name: "Combinación", desc: "Une frases con conectores", color: "bg-warning/10 border-warning/20" },
  { id: "slang", icon: "🗣️", name: "Slang", desc: "Adivina expresiones informales", color: "bg-error/10 border-error/20" },
  { id: "pronunciation", icon: "🎤", name: "Pronunciación", desc: "Aprende trucos de pronunciación", color: "bg-purple-100 border-purple-200" },
];

export default function Home({ onStartMode }) {
  return (
    <div className="p-4 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text">¡Practica inglés!</h1>
        <p className="text-text-secondary mt-1">Elige un modo para comenzar</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {MODES.map(mode => (
          <button
            key={mode.id}
            onClick={() => onStartMode(mode.id)}
            className={`${mode.color} border rounded-2xl p-4 text-left hover:scale-[1.02] active:scale-[0.98] transition-transform`}
          >
            <span className="text-3xl">{mode.icon}</span>
            <h3 className="font-bold text-text mt-2">{mode.name}</h3>
            <p className="text-sm text-text-secondary mt-1">{mode.desc}</p>
          </button>
        ))}
      </div>

      <button
        onClick={() => onStartMode("course")}
        className="w-full bg-primary/10 border border-primary/20 rounded-2xl p-4 text-left hover:scale-[1.02] active:scale-[0.98] transition-transform flex items-center gap-3"
      >
        <span className="text-3xl">📖</span>
        <div>
          <h3 className="font-bold text-text">Curso</h3>
          <p className="text-sm text-text-secondary">Aprende inglés paso a paso</p>
        </div>
      </button>

      <button
        onClick={() => onStartMode("competitive")}
        className="w-full bg-primary text-white rounded-2xl p-4 font-bold text-lg hover:bg-primary/90 active:scale-[0.98] transition-all"
      >
        🏆 Modo Competitivo
      </button>
    </div>
  );
}
