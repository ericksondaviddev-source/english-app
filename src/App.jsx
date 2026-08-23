import { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Home from './components/Home';
import Practice from './components/Practice';
import Ranking from './components/Ranking';
import Profile from './components/Profile';
import Course from './components/Course';
import { MultiplayerMenu, Lobby, RaceMode, DuelMode, BattleRoyale } from './components/multiplayer';
import { useGameState } from './hooks/useGameState';
import { useStorage } from './hooks/useStorage';

export default function App() {
  const [screen, setScreen] = useState("home");
  const [practiceMode, setPracticeMode] = useState(null);
  const [darkMode, setDarkMode] = useStorage("eng_darkMode", false);
  const gameState = useGameState();
  
  // Multiplayer state
  const [gameMode, setGameMode] = useState(null);
  const [gameRoomId, setGameRoomId] = useState(null);

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

  // Multiplayer handlers
  const handleStartMultiplayer = () => setScreen("multiplayer-menu");
  
  const handleCreateRoom = (roomId, mode) => {
    setGameRoomId(roomId);
    setGameMode(mode);
    setScreen("multiplayer-lobby");
  };
  
  const handleGameStart = (roomId, mode) => {
    setGameRoomId(roomId);
    setGameMode(mode);
    if (mode === 'race') setScreen("multiplayer-race");
    else if (mode === 'duel') setScreen("multiplayer-duel");
    else if (mode === 'battleRoyale') setScreen("multiplayer-battle-royale");
  };
  
  const handleGameEnd = (score, questions, streak, lives, rank, total) => {
    setScreen("multiplayer-menu");
  };

  const renderScreen = () => {
    switch (screen) {
      case "home":
        return <Home onStartMode={handleStartMode} onStartMultiplayer={handleStartMultiplayer} />;
      case "course":
        return <Course gameState={gameState} onBack={handleBack} />;
      case "practice":
        return <Practice mode={practiceMode} gameState={gameState} onBack={handleBack} />;
      case "ranking":
        return <Ranking gameState={gameState} />;
      case "profile":
        return <Profile gameState={gameState} darkMode={darkMode} setDarkMode={setDarkMode} />;
      case "multiplayer-menu":
        return <MultiplayerMenu onBack={handleBack} onStartGame={handleCreateRoom} />;
      case "multiplayer-lobby":
        return <Lobby onBack={() => setScreen("multiplayer-menu")} onStartGame={handleGameStart} />;
      case "multiplayer-race":
        return <RaceMode roomId={gameRoomId} onGameEnd={handleGameEnd} />;
      case "multiplayer-duel":
        return <DuelMode roomId={gameRoomId} onGameEnd={handleGameEnd} />;
      case "multiplayer-battle-royale":
        return <BattleRoyale roomId={gameRoomId} onGameEnd={handleGameEnd} />;
      default:
        return <Home onStartMode={handleStartMode} onStartMultiplayer={handleStartMultiplayer} />;
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
