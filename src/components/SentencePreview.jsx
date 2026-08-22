export default function SentencePreview({ words, onClear, onRemoveWord }) {
  if (words.length === 0) {
    return (
      <div className="bg-bg-secondary border-2 border-dashed border-border rounded-xl p-6 text-center">
        <p className="text-text-secondary text-sm">
          Selecciona bloques para construir tu frase
        </p>
      </div>
    );
  }

  return (
    <div className="bg-bg border border-border rounded-xl p-4">
      <div className="flex items-center gap-2 flex-wrap">
        {words.map((word, i) => (
          <span
            key={i}
            onClick={() => onRemoveWord(i)}
            className="inline-flex items-center gap-1 bg-primary/10 text-primary px-3 py-1.5 rounded-lg text-sm font-mono font-medium cursor-pointer hover:bg-primary/20 transition-colors"
          >
            {word}
            <span className="text-primary/50 text-xs">×</span>
          </span>
        ))}
      </div>
      <button
        onClick={onClear}
        className="mt-3 text-xs text-text-secondary hover:text-error transition-colors"
      >
        Limpiar todo
      </button>
    </div>
  );
}
