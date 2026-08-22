import ScoreBar from './ScoreBar';

const NAV_ITEMS = [
  { id: "home", icon: "🏠", label: "Home" },
  { id: "practice", icon: "📚", label: "Practicar" },
  { id: "ranking", icon: "🎯", label: "Ranking" },
  { id: "profile", icon: "👤", label: "Perfil" },
];

export default function Layout({ children, gameState, onNavigate, currentScreen }) {
  return (
    <div className="min-h-screen bg-bg flex flex-col">
      <ScoreBar 
        points={gameState.points} 
        level={gameState.level} 
        streak={gameState.streak} 
      />

      <main className="flex-1 pb-20 overflow-y-auto">
        {children}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-bg border-t border-border h-[65px] flex items-center justify-around z-50">
        {NAV_ITEMS.map(item => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
              currentScreen === item.id 
                ? "text-primary" 
                : "text-text-secondary hover:text-text"
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="text-xs font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
