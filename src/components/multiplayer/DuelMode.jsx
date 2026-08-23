import { useState, useEffect, useCallback } from 'react';
import { Swords, Check, X, ArrowRight, Loader2, Heart, Shield } from 'lucide-react';
import GlassCard from '../base/GlassCard';
import GradientButton from '../base/GradientButton';
import GameHUD from './GameHUD';
import { useMultiplayer } from '../../hooks/useMultiplayer';
import { hybridTranslate } from '../../services/translationService';
import { getCurrentUser } from '../../services/authService';

export default function DuelMode({ roomId, onGameEnd }) {
  const { room, updateProgress, endGame } = useMultiplayer();
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(120);
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [streak, setStreak] = useState(0);
  const [lives, setLives] = useState(3);
  const [loading, setLoading] = useState(true);
  const [gameActive, setGameActive] = useState(false);
  const [opponentProgress, setOpponentProgress] = useState(0);

  const currentUserId = getCurrentUser()?.uid;

  useEffect(() => {
    const generateQuestions = async () => {
      const sampleWords = [
        'Hola', 'Adiós', 'Gracias', 'Por favor', 'Buenos días',
        'Buenas tardes', 'Buenas noches', '¿Cómo estás?', 'Me llamo',
        '¿Cuánto cuesta?', 'No entiendo', '¿Dónde está?',
        'Sí', 'No', 'Tal vez', 'Siempre', 'Nunca'
      ];
      
      const q = sampleWords.slice(0, room?.settings?.questionCount || 10).map(word => ({
        spanish: word,
        english: null,
        answered: false
      }));
      
      for (let question of q) {
        const result = await hybridTranslate(question.spanish);
        question.english = result.translation.toLowerCase().trim();
      }
      
      setQuestions(q);
      setLoading(false);
    };
    
    generateQuestions();
  }, [room?.settings?.questionCount]);

  useEffect(() => {
    if (room?.status === 'playing') {
      setGameActive(true);
    }
  }, [room?.status]);

  useEffect(() => {
    if (!gameActive || timeLeft <= 0) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [gameActive, timeLeft]);

  useEffect(() => {
    if (!room?.players) return;
    
    const opponent = Object.entries(room.players).find(([uid]) => uid !== currentUserId);
    if (opponent) {
      const [, data] = opponent;
      setOpponentScore(data.score || 0);
      setOpponentProgress(data.progress || 0);
    }
  }, [room?.players, currentUserId]);

  const handleTimeUp = useCallback(() => {
    setGameActive(false);
    endGame();
    onGameEnd(score, currentQ, streak, lives);
  }, [score, currentQ, streak, lives, endGame, onGameEnd]);

  const handleSubmitAnswer = async () => {
    if (!userInput.trim() || !gameActive) return;
    
    const question = questions[currentQ];
    const isCorrect = userInput.toLowerCase().trim() === question.english;
    
    if (isCorrect) {
      const timeBonus = Math.floor(timeLeft / 10);
      const streakBonus = streak * 5;
      const pointsEarned = 10 + timeBonus + streakBonus;
      
      setScore(prev => prev + pointsEarned);
      setStreak(prev => prev + 1);
      setFeedback({ type: 'correct', points: pointsEarned });
      
      await updateProgress(currentQ + 1, score + pointsEarned);
    } else {
      setStreak(0);
      setLives(prev => prev - 1);
      setFeedback({ type: 'wrong', correct: question.english });
      
      if (lives - 1 <= 0) {
        setTimeout(() => {
          setGameActive(false);
          endGame();
          onGameEnd(score, currentQ, streak, 0);
        }, 1500);
      }
    }
    
    setUserInput('');
    
    setTimeout(() => {
      setFeedback(null);
      if (currentQ + 1 < questions.length && lives > 0) {
        setCurrentQ(prev => prev + 1);
      } else if (lives > 0) {
        setGameActive(false);
        endGame();
        onGameEnd(score, questions.length, streak, lives);
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
          <Loader2 className="w-12 h-12 text-red-500 animate-spin mx-auto mb-4" />
          <p className="text-[var(--text-secondary)]">Preparando duelo...</p>
        </div>
      </div>
    );
  }

  const question = questions[currentQ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--bg-primary)] via-[var(--bg-secondary)] to-[var(--bg-tertiary)] p-4 sm:p-6">
      <div className="max-w-2xl mx-auto">
        <GameHUD
          score={score}
          progress={(currentQ / questions.length) * 100}
          timeLeft={timeLeft}
          totalQuestions={questions.length}
          currentQuestion={currentQ}
          streak={streak}
        />

        <div className="flex items-center justify-between mb-6">
          <GlassCard className="flex-1">
            <div className="p-4 text-center">
              <p className="text-sm text-[var(--text-secondary)] mb-1">Tú</p>
              <p className="text-2xl font-bold text-[var(--accent-primary)]">{score}</p>
            </div>
          </GlassCard>
          
          <div className="px-4">
            <Swords className="w-10 h-10 text-red-500" />
          </div>
          
          <GlassCard className="flex-1">
            <div className="p-4 text-center">
              <p className="text-sm text-[var(--text-secondary)] mb-1">Oponente</p>
              <p className="text-2xl font-bold text-red-400">{opponentScore}</p>
            </div>
          </GlassCard>
        </div>

        <div className="flex justify-center gap-2 mb-6">
          {[...Array(3)].map((_, i) => (
            <Heart
              key={i}
              className={`w-6 h-6 ${
                i < lives 
                  ? 'text-red-500 fill-red-500' 
                  : 'text-gray-600'
              }`}
            />
          ))}
        </div>

        <GlassCard className="mb-6">
          <div className="p-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Shield className="w-6 h-6 text-red-500" />
              <span className="text-sm text-[var(--text-secondary)]">Pregunta {currentQ + 1} de {questions.length}</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)] mb-6">
              {question.spanish}
            </h2>

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

            <div className="flex gap-3">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Escribe la traducción en inglés..."
                className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-red-500 transition-all text-center text-xl"
                disabled={!gameActive || feedback || lives <= 0}
                autoFocus
              />
              <GradientButton
                onClick={handleSubmitAnswer}
                disabled={!userInput.trim() || !gameActive || feedback || lives <= 0}
                className="px-6 bg-gradient-to-r from-red-500 to-orange-500"
              >
                <ArrowRight className="w-5 h-5" />
              </GradientButton>
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-[var(--text-secondary)]">Progreso del oponente</span>
              <span className="text-sm text-red-400">{opponentProgress}/{questions.length}</span>
            </div>
            <div className="h-3 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-red-500 to-orange-500 transition-all duration-300"
                style={{ width: `${(opponentProgress / questions.length) * 100}%` }}
              />
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
