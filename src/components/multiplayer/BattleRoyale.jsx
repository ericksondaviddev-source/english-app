import { useState, useEffect, useCallback } from 'react';
import { Crown, Check, X, ArrowRight, Loader2, Skull, Users, Timer } from 'lucide-react';
import GlassCard from '../base/GlassCard';
import GradientButton from '../base/GradientButton';
import GameHUD from './GameHUD';
import { useMultiplayer } from '../../hooks/useMultiplayer';
import { hybridTranslate } from '../../services/translationService';
import { getCurrentUser } from '../../services/authService';

export default function BattleRoyale({ roomId, onGameEnd }) {
  const { room, updateProgress, endGame } = useMultiplayer(roomId);
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(120);
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [streak, setStreak] = useState(0);
  const [lives, setLives] = useState(5);
  const [loading, setLoading] = useState(true);
  const [gameActive, setGameActive] = useState(false);
  const [eliminatedPlayers, setEliminatedPlayers] = useState([]);
  const [alivePlayers, setAlivePlayers] = useState([]);
  const [roundNumber, setRoundNumber] = useState(1);
  const [isSafe, setIsSafe] = useState(true);

  const currentUserId = getCurrentUser()?.uid;

  // Generate questions on mount
  useEffect(() => {
    const generateQuestions = async () => {
      const sampleWords = [
        'Hola', 'Adiós', 'Gracias', 'Por favor', 'Buenos días',
        'Buenas tardes', 'Buenas noches', '¿Cómo estás?', 'Me llamo',
        '¿Cuánto cuesta?', 'No entiendo', '¿Dónde está?',
        'Sí', 'No', 'Tal vez', 'Siempre', 'Nunca',
        'Comer', 'Beber', 'Dormir', 'Correr', 'Caminar'
      ];
      
      const q = sampleWords.slice(0, room?.settings?.questionCount || 10).map(word => ({
        spanish: word,
        english: null,
        answered: false,
        round: 1
      }));
      
      // Pre-fetch translations
      for (let question of q) {
        const result = await hybridTranslate(question.spanish);
        question.english = result.translation.toLowerCase().trim();
      }
      
      setQuestions(q);
      setLoading(false);
    };
    
    generateQuestions();
  }, [room?.settings?.questionCount]);

  // Initialize alive players
  useEffect(() => {
    if (room?.players) {
      const players = Object.entries(room.players).map(([uid, data]) => ({
        uid,
        name: data.displayName,
        lives: 5,
        score: 0
      }));
      setAlivePlayers(players);
    }
  }, [room?.players]);

  // Start timer when game becomes active
  useEffect(() => {
    if (room?.status === 'playing') {
      setGameActive(true);
    }
  }, [room?.status]);

  // Timer
  useEffect(() => {
    if (!gameActive || timeLeft <= 0) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleTimeUp();
          return 0;
        }
        
        // Storm closing every 30 seconds
        if (prev % 30 === 0 && prev < 120) {
          handleStormClosing();
        }
        
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [gameActive, timeLeft]);

  const handleStormClosing = useCallback(() => {
    setRoundNumber(prev => prev + 1);
    setIsSafe(false);
    
    // Players who didn't answer in time lose a life
    setAlivePlayers(prev => 
      prev.map(p => {
        if (p.uid === currentUserId && !isSafe) {
          return { ...p, lives: p.lives - 1 };
        }
        return p;
      }).filter(p => p.lives > 0)
    );
    
    setTimeout(() => setIsSafe(true), 3000);
  }, [currentUserId, isSafe]);

  const handleTimeUp = useCallback(() => {
    setGameActive(false);
    endGame();
    
    // Final ranking
    const finalRanking = alivePlayers
      .sort((a, b) => b.score - a.score || b.lives - a.lives);
    
    const playerRank = finalRanking.findIndex(p => p.uid === currentUserId) + 1;
    
    onGameEnd(score, currentQ, streak, lives, playerRank, finalRanking.length);
  }, [score, currentQ, streak, lives, alivePlayers, currentUserId, endGame, onGameEnd]);

  const handleSubmitAnswer = async () => {
    if (!userInput.trim() || !gameActive) return;
    
    const question = questions[currentQ];
    const isCorrect = userInput.toLowerCase().trim() === question.english;
    
    if (isCorrect) {
      const timeBonus = Math.floor(timeLeft / 10);
      const streakBonus = streak * 5;
      const roundBonus = roundNumber * 2;
      const pointsEarned = 10 + timeBonus + streakBonus + roundBonus;
      
      setScore(prev => prev + pointsEarned);
      setStreak(prev => prev + 1);
      setFeedback({ type: 'correct', points: pointsEarned });
      
      // Update progress in Firebase
      await updateProgress(currentQ + 1, score + pointsEarned);
    } else {
      setStreak(0);
      setLives(prev => prev - 1);
      setFeedback({ type: 'wrong', correct: question.english });
      
      // Check if eliminated
      if (lives - 1 <= 0) {
        setEliminatedPlayers(prev => [...prev, { uid: currentUserId, name: getCurrentUser()?.displayName }]);
        setTimeout(() => {
          setGameActive(false);
          endGame();
          onGameEnd(score, currentQ, streak, 0, alivePlayers.length, alivePlayers.length);
        }, 1500);
      }
    }
    
    setUserInput('');
    
    // Move to next question after delay
    setTimeout(() => {
      setFeedback(null);
      if (currentQ + 1 < questions.length && lives > 0) {
        setCurrentQ(prev => prev + 1);
      } else if (lives > 0) {
        // Game complete
        setGameActive(false);
        endGame();
        const finalRanking = alivePlayers.sort((a, b) => b.score - a.score);
        const playerRank = finalRanking.findIndex(p => p.uid === currentUserId) + 1;
        onGameEnd(score, questions.length, streak, lives, playerRank, finalRanking.length);
      }
    }, 1500);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmitAnswer();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[var(--bg-primary)] via-[var(--bg-secondary)] to-[var(--bg-tertiary)] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-purple-500 animate-spin mx-auto mb-4" />
          <p className="text-[var(--text-secondary)]">Preparando Battle Royale...</p>
        </div>
      </div>
    );
  }

  const question = questions[currentQ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--bg-primary)] via-[var(--bg-secondary)] to-[var(--bg-tertiary)] p-4 sm:p-6">
      <div className="max-w-2xl mx-auto">
        {/* HUD */}
        <GameHUD
          score={score}
          progress={(currentQ / questions.length) * 100}
          timeLeft={timeLeft}
          totalQuestions={questions.length}
          currentQuestion={currentQ}
          streak={streak}
        />

        {/* Battle Royale Header */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <GlassCard>
            <div className="p-3 text-center">
              <Users className="w-6 h-6 text-green-400 mx-auto mb-1" />
              <p className="text-xl font-bold text-green-400">{alivePlayers.length}</p>
              <p className="text-xs text-[var(--text-tertiary)]">Vivos</p>
            </div>
          </GlassCard>
          
          <GlassCard>
            <div className="p-3 text-center">
              <Skull className="w-6 h-6 text-red-400 mx-auto mb-1" />
              <p className="text-xl font-bold text-red-400">{eliminatedPlayers.length}</p>
              <p className="text-xs text-[var(--text-tertiary)]">Eliminados</p>
            </div>
          </GlassCard>
          
          <GlassCard>
            <div className="p-3 text-center">
              <Timer className="w-6 h-6 text-yellow-400 mx-auto mb-1" />
              <p className="text-xl font-bold text-yellow-400">Ronda {roundNumber}</p>
              <p className="text-xs text-[var(--text-tertiary)]">Tormenta</p>
            </div>
          </GlassCard>
        </div>

        {/* Lives Display */}
        <div className="flex justify-center gap-2 mb-6">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                i < lives 
                  ? 'bg-purple-500/20 border-2 border-purple-500' 
                  : 'bg-white/5 border-2 border-white/10'
              }`}
            >
              {i < lives ? (
                <Crown className="w-4 h-4 text-purple-400" />
              ) : (
                <Skull className="w-4 h-4 text-gray-600" />
              )}
            </div>
          ))}
        </div>

        {/* Storm Warning */}
        {!isSafe && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/20 border border-red-500/30 text-center animate-pulse">
            <p className="text-red-400 font-bold">¡La tormenta está cerrando!</p>
          </div>
        )}

        {/* Question Card */}
        <GlassCard className="mb-6">
          <div className="p-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Crown className="w-6 h-6 text-purple-500" />
              <span className="text-sm text-[var(--text-secondary)]">Pregunta {currentQ + 1} de {questions.length}</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)] mb-6">
              {question.spanish}
            </h2>

            {/* Feedback */}
            {feedback && (
              <div className={`mb-4 p-4 rounded-xl animate-in fade-in zoom-in-95 ${
                feedback.type === 'correct' 
                  ? 'bg-green-500/20 border border-green-500/30' 
                  : 'bg-red-500/20 border border-red-500/30'
              }`}>
                {feedback.type === 'correct' ? (
                  <div className="flex items-center justify-center gap-2 text-green-400">
                    <Check className="w-6 h-6" />
                    <span className="font-bold">¡Correcto! +{feedback.points} puntos</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2 text-red-400">
                    <X className="w-6 h-6" />
                    <span className="font-bold">Incorrecto: {feedback.correct}</span>
                  </div>
                )}
              </div>
            )}

            {/* Input */}
            <div className="flex gap-3">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Escribe la traducción en inglés..."
                className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all text-center text-xl"
                disabled={!gameActive || feedback || lives <= 0}
                autoFocus
              />
              <GradientButton
                onClick={handleSubmitAnswer}
                disabled={!userInput.trim() || !gameActive || feedback || lives <= 0}
                className="px-6 bg-gradient-to-r from-purple-500 to-pink-500"
              >
                <ArrowRight className="w-5 h-5" />
              </GradientButton>
            </div>
          </div>
        </GlassCard>

        {/* Alive Players List */}
        <GlassCard>
          <div className="p-4">
            <h3 className="font-semibold text-[var(--text-primary)] mb-3 flex items-center gap-2">
              <Crown className="w-5 h-5 text-purple-400" />
              Jugadores Vivos ({alivePlayers.length})
            </h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {alivePlayers
                .sort((a, b) => b.score - a.score)
                .map((player) => (
                  <div 
                    key={player.uid} 
                    className={`flex items-center gap-3 p-2 rounded-lg ${
                      player.uid === currentUserId 
                        ? 'bg-purple-500/20 border border-purple-500/30' 
                        : 'bg-white/5'
                    }`}
                  >
                    <div className="flex gap-1">
                      {[...Array(player.lives)].map((_, i) => (
                        <Crown key={i} className="w-3 h-3 text-purple-400" />
                      ))}
                    </div>
                    <span className="flex-1 text-sm text-[var(--text-primary)]">
                      {player.name}
                      {player.uid === currentUserId && ' (Tú)'}
                    </span>
                    <span className="text-sm font-mono text-purple-400">{player.score}</span>
                  </div>
                ))}
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
