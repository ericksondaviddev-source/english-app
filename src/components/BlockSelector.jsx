import { useState } from 'react';

const CATEGORIES = [
  { id: "pronouns", label: "Pronombres", color: "bg-primary/10 text-primary" },
  { id: "verbs", label: "Verbos", color: "bg-success/10 text-success" },
  { id: "objects", label: "Objetos", color: "bg-warning/10 text-warning" },
  { id: "connectors", label: "Conectores", color: "bg-error/10 text-error" },
];

export default function BlockSelector({ data, onSelect, selected }) {
  const [activeCategory, setActiveCategory] = useState("pronouns");

  const getItems = () => {
    switch (activeCategory) {
      case "pronouns": return data.pronouns;
      case "verbs": return data.verbs.present;
      case "objects": return data.objects;
      case "connectors": return data.connectors;
      default: return [];
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 overflow-x-auto pb-2">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              activeCategory === cat.id
                ? cat.color
                : "bg-bg-secondary text-text-secondary hover:bg-border"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {getItems().map(word => (
          <button
            key={word}
            onClick={() => onSelect(word)}
            className={`min-h-[48px] px-3 py-2 rounded-xl border-2 text-sm font-medium transition-all active:scale-95 ${
              selected.includes(word)
                ? "border-primary bg-primary/10 text-primary"
                : "border-border bg-bg text-text hover:border-primary/50"
            }`}
          >
            {word}
          </button>
        ))}
      </div>
    </div>
  );
}
