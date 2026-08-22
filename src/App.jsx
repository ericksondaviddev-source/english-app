import { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Home from './components/Home';
import Practice from './components/Practice';
import Ranking from './components/Ranking';
import Profile from './components/Profile';
import Course from './components/Course';
import { useGameState } from './hooks/useGameState';
import { useStorage } from './hooks/useStorage';

export default function App() {
  const [screen, setScreen] = useState("home");
  const [practiceMode, setPracticeMode] = useState(null);
  const [darkMode, setDarkMode] = useStorage("eng_darkMode", false);
  const gameState = useGameState();

  // Apply dark mode to html element
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const handleStartMode = (mode) => {
    if (mode === "course") {
      setScreen("course");
    } else {
      setPracticeMode(mode);
      setScreen("practice");
    }
  };

  const handleBack = () => {
    setPracticeMode(null);
    setScreen("home");
  };

  const renderScreen = () => {
    switch (screen) {
      case "home":
        return <Home onStartMode={handleStartMode} />;
      case "course":
        return <Course gameState={gameState} onBack={handleBack} />;
      case "practice":
        return <Practice mode={practiceMode} gameState={gameState} onBack={handleBack} />;
      case "ranking":
        return <Ranking gameState={gameState} />;
      case "profile":
        return <Profile gameState={gameState} darkMode={darkMode} setDarkMode={setDarkMode} />;
      default:
        return <Home onStartMode={handleStartMode} />;
    }
  };

  return (
    <Layout 
      gameState={gameState} 
      onNavigate={setScreen} 
      currentScreen={screen}
    >
      {renderScreen()}
    </Layout>
  );
}
