import { Home, BookOpen, Target, User } from 'lucide-react';
import { cn } from '../utils/cn';
import ScoreBar from './ScoreBar';

const NAV_ITEMS = [
  { id: "home", icon: Home, label: "Home" },
  { id: "practice", icon: BookOpen, label: "Practicar" },
  { id: "ranking", icon: Target, label: "Ranking" },
  { id: "profile", icon: User, label: "Perfil" },
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

      <nav className="fixed bottom-0 left-0 right-0 glass border-t border-border-light h-[70px] flex items-center justify-around z-50 animate-fade-in-down">
        {NAV_ITEMS.map(item => {
          const Icon = item.icon;
          const isActive = currentScreen === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={cn(
                "flex flex-col items-center gap-1.5 px-4 py-2 rounded-xl transition-smooth",
                isActive 
                  ? "text-primary bg-primary/10" 
                  : "text-text-secondary hover:text-text hover:bg-bg-secondary"
              )}
            >
              <Icon className={cn("w-5 h-5", isActive && "text-primary")} />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
