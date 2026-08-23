import { useState, useEffect, useCallback } from 'react';
import { Zap, Check, X, ArrowRight, Loader2 } from 'lucide-react';
import GlassCard from '../base/GlassCard';
import GradientButton from '../base/GradientButton';
import GameHUD from './GameHUD';
import { useMultiplayer } from '../../hooks/useMultiplayer';
import { hybridTranslate } from '../../services/translationService';
import { getCurrentUser } from '../../services/authService';

export default function RaceMode({ roomId, onGameEnd }) {
  const { room, updateProgress, endGame } = useMultiplayer();
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(120);
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true);
  const [gameActive, setGameActive] = useState(false);

  // Generate questions on mount
  useEffect(() => {
    const generateQuestions = async () => {
      const sampleWords = [
        'Hola', 'Adiós', 'Gracias', 'Por favor', 'Buenos días',
        'Buenas tardes', 'Buenas noches', '¿Cómo estás?', 'Me llamo',
        '¿Cuánto cuesta?', 'No entiendo', '¿Dónde está?'
      ];
      
      const q = sampleWords.slice(0, room?.settings?.questionCount || 10).map(word => ({
        spanish: word,
        english: null,
        answered: false
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
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [gameActive, timeLeft]);

  const handleTimeUp = useCallback(() => {
    setGameActive(false);
    endGame();
    onGameEnd(score, currentQ, streak);
  }, [score, currentQ, streak, endGame, onGameEnd]);

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
      
      // Update progress in Firebase
      await updateProgress(currentQ + 1, score + pointsEarned);
    } else {
      setStreak(0);
      setFeedback({ type: 'wrong', correct: question.english });
    }
    
    setUserInput('');
    
    // Move to next question after delay
    setTimeout(() => {
      setFeedback(null);
      if (currentQ + 1 < questions.length) {
        setCurrentQ(prev => prev + 1);
      } else {
        // Game complete
        setGameActive(false);
        endGame();
        onGameEnd(score, questions.length, streak);
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
          <Loader2 className="w-12 h-12 text-[var(--accent-primary)] animate-spin mx-auto mb-4" />
          <p className="text-[var(--text-secondary)]">Preparando carrera...</p>
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

        {/* Race Track Visualization */}
        <div className="mb-6">
          <div className="h-4 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[var(--accent-primary)] via-[var(--accent-secondary)] to-yellow-400 transition-all duration-500 ease-out"
              style={{ width: `${(currentQ / questions.length) * 100}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 text-xs text-[var(--text-tertiary)]">
            <span>Inicio</span>
            <span>¡Meta!</span>
          </div>
        </div>

        {/* Question Card */}
        <GlassCard className="mb-6">
          <div className="p-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Zap className="w-6 h-6 text-yellow-400" />
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
                className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] transition-all text-center text-xl"
                disabled={!gameActive || feedback}
                autoFocus
              />
              <GradientButton
                onClick={handleSubmitAnswer}
                disabled={!userInput.trim() || !gameActive || feedback}
                className="px-6"
              >
                <ArrowRight className="w-5 h-5" />
              </GradientButton>
            </div>
          </div>
        </GlassCard>

        {/* Leaderboard Preview */}
        {room?.players && (
          <GlassCard>
            <div className="p-4">
              <h3 className="font-semibold text-[var(--text-primary)] mb-3">Clasificación</h3>
              <div className="space-y-2">
                {Object.entries(room.players)
                  .sort(([, a], [, b]) => (b.score || 0) - (a.score || 0))
                  .map(([uid, player], index) => (
                    <div key={uid} className="flex items-center gap-3 p-2 rounded-lg bg-white/5">
                      <span className="w-6 text-center font-bold text-[var(--text-secondary)]">
                        {index + 1}
                      </span>
                      <span className="flex-1 text-[var(--text-primary)]">{player.displayName}</span>
                      <span className="font-mono text-[var(--accent-primary)]">{player.score || 0}</span>
                    </div>
                  ))}
              </div>
            </div>
          </GlassCard>
        )}
      </div>
    </div>
  );
}
