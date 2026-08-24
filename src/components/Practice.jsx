import { useState, useCallback } from 'react';
import { ArrowLeft, Check, X, Volume2, Lightbulb, RotateCcw, Loader2 } from 'lucide-react';
import { cn } from '../utils/cn';
import GlassCard from './base/GlassCard';
import GradientButton from './base/GradientButton';
import BlockSelector from './BlockSelector';
import SentencePreview from './SentencePreview';
import AudioControls from './AudioControls';
import AchievementToast from './AchievementToast';
import { speakGoogleTTS, getAllListenBuildPhrases } from '../utils/googleTTS';
import { validateConstruction, validateCombination, generateRandomSentence } from '../utils/sentenceValidator';
import { pronouns, verbs, objects, connectors, informalExpressions, pronunciationTips, sentenceTranslations, translations } from '../data/languageData';

function speak(text, lang = 'en-US', rate = 0.8) {
  if (window.speechSynthesis) {
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang;
    u.rate = rate;
    window.speechSynthesis.speak(u);
  }
}

function buildNegative(sentence) {
  const s = sentence.trim();
  const t = s.toLowerCase();
  if (t.startsWith('i ')) return `I don't ${s.slice(2)}`;
  if (t.startsWith('you ')) return `You don't ${s.slice(4)}`;
  if (t.startsWith('he ')) return `He doesn't ${s.slice(3)}`;
  if (t.startsWith('she ')) return `She doesn't ${s.slice(4)}`;
  if (t.startsWith('it ')) return `It doesn't ${s.slice(3)}`;
  if (t.startsWith('we ')) return `We don't ${s.slice(3)}`;
  if (t.startsWith('they ')) return `They don't ${s.slice(5)}`;
  if (t.includes(' will ')) return s.replace(' will ', ` won't `);
  if (t.includes(' can ')) return s.replace(' can ', ` can't `);
  if (t.includes(' are ')) {
    const idx = t.indexOf(' are ');
    return s.slice(0, idx) + ` aren't` + s.slice(idx + 4);
  }
  if (t.includes(' is ')) {
    const idx = t.indexOf(' is ');
    return s.slice(0, idx) + ` isn't` + s.slice(idx + 3);
  }
  if (t.includes(' do ')) {
    const idx = t.indexOf(' do ');
    return s.slice(0, idx) + ` don't` + s.slice(idx + 3);
  }
  const firstSpace = s.indexOf(' ');
  if (firstSpace > 0) {
    const subject = s.slice(0, firstSpace);
    const rest = s.slice(firstSpace);
    return `${subject} don't${rest}`;
  }
  return `don't ${s}`;
}

function buildQuestion(sentence) {
  const s = sentence.trim();
  const t = s.toLowerCase();
  if (t.startsWith('i ')) return `Do I ${s.slice(2)}?`;
  if (t.startsWith('you ')) return `Do you ${s.slice(4)}?`;
  if (t.startsWith('he ')) return `Does he ${s.slice(3)}?`;
  if (t.startsWith('she ')) return `Does she ${s.slice(4)}?`;
  if (t.startsWith('it ')) return `Does it ${s.slice(3)}?`;
  if (t.startsWith('we ')) return `Do we ${s.slice(3)}?`;
  if (t.startsWith('they ')) return `Do they ${s.slice(5)}?`;
  if (t.includes(' will ')) {
    const idx = t.indexOf(' will ');
    return `Will ${s.slice(0, idx).toLowerCase()}${s.slice(idx + 5)}?`;
  }
  if (t.includes(' can ')) {
    const idx = t.indexOf(' can ');
    return `Can ${s.slice(0, idx).toLowerCase()}${s.slice(idx + 4)}?`;
  }
  if (t.includes(' are ')) {
    const idx = t.indexOf(' are ');
    return `Are ${s.slice(0, idx).toLowerCase()}${s.slice(idx + 4)}?`;
  }
  if (t.includes(' is ')) {
    const idx = t.indexOf(' is ');
    return `Is ${s.slice(0, idx).toLowerCase()}${s.slice(idx + 3)}?`;
  }
  return `${s}?`;
}

// Construction Mode
function ConstructionMode({ onValidate }) {
  const [selectedWords, setSelectedWords] = useState([]);
  const data = { pronouns, verbs, objects, connectors };

  const handleSelect = useCallback((word) => {
    setSelectedWords(prev => [...prev, word]);
  }, []);

  const handleRemove = useCallback((index) => {
    setSelectedWords(prev => prev.filter((_, i) => i !== index));
  }, []);

  const handleClear = useCallback(() => {
    setSelectedWords([]);
  }, []);

  return (
    <div className="space-y-4">
      <GlassCard>
        <SentencePreview words={selectedWords} onClear={handleClear} onRemoveWord={handleRemove} />
      </GlassCard>
      <BlockSelector data={data} onSelect={handleSelect} selected={selectedWords} />
      <GradientButton
        variant="primary"
        className="w-full"
        onClick={() => {
          const result = validateConstruction(selectedWords);
          onValidate(result, selectedWords.join(" "));
          if (result.valid) setSelectedWords([]);
        }}
        disabled={selectedWords.length < 3}
      >
        Validar frase
      </GradientButton>
    </div>
  );
}

// Mutation Mode
function MutationMode({ onValidate }) {
  const [sentence, setSentence] = useState('');
  const [mutated, setMutated] = useState('');
  const [targetMode, setTargetMode] = useState('negative');
  const [showOriginal, setShowOriginal] = useState(false);

  const negativeForm = sentence ? buildNegative(sentence) : '';
  const questionForm = sentence ? buildQuestion(sentence) : '';

  const handleNewSentence = () => {
    setSentence(generateRandomSentence());
    setMutated('');
    setShowOriginal(false);
    setTargetMode('negative');
  };

  return (
    <div className="space-y-4">
      <GradientButton variant="ghost" className="w-full" onClick={handleNewSentence}>
        <div className="flex items-center justify-center gap-2">
          <RotateCcw className="w-4 h-4" />
          <span>{sentence ? "Nueva frase" : "Generar frase"}</span>
        </div>
      </GradientButton>

      {sentence && (
        <>
          <GlassCard>
            <p className="text-sm text-text-secondary mb-1">Frase original:</p>
            <div className="flex items-center justify-between">
              <p className="font-mono text-lg font-semibold text-text">{sentence}</p>
              <button onClick={() => speak(sentence)} className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-smooth">
                <Volume2 className="w-4 h-4 text-primary" />
              </button>
            </div>
          </GlassCard>

          <div className="grid grid-cols-2 gap-3">
            <GlassCard className="bg-bg-secondary">
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs text-text-secondary">Negativo</p>
                <button onClick={() => speak(negativeForm)} className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-smooth">
                  <Volume2 className="w-3 h-3 text-primary" />
                </button>
              </div>
              <p className="font-mono text-sm text-text">{negativeForm}</p>
            </GlassCard>
            <GlassCard className="bg-bg-secondary">
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs text-text-secondary">Pregunta</p>
                <button onClick={() => speak(questionForm)} className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-smooth">
                  <Volume2 className="w-3 h-3 text-primary" />
                </button>
              </div>
              <p className="font-mono text-sm text-text">{questionForm}</p>
            </GlassCard>
          </div>

          <div className="flex gap-2">
            {['negative', 'question'].map(m => (
              <button
                key={m}
                onClick={() => { setTargetMode(m); setMutated(''); setShowOriginal(false); }}
                className={cn(
                  "flex-1 py-2.5 rounded-xl text-sm font-medium transition-smooth",
                  targetMode === m 
                    ? "bg-primary text-white shadow-md" 
                    : "bg-bg-secondary text-text-secondary hover:bg-bg-tertiary"
                )}
              >
                {m === 'negative' ? 'Negativo' : 'Pregunta'}
              </button>
            ))}
          </div>

          <input
            type="text"
            value={mutated}
            onChange={(e) => setMutated(e.target.value)}
            placeholder={targetMode === 'negative' ? 'Escribe la forma negativa...' : 'Escribe la pregunta...'}
            className="w-full bg-bg border border-border rounded-xl px-4 py-3 text-text placeholder-text-secondary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-smooth"
          />

          <GradientButton
            variant="primary"
            className="w-full"
            onClick={() => {
              const expected = targetMode === 'negative' ? negativeForm : questionForm;
              const isCorrect = mutated.trim().toLowerCase() === expected.trim().toLowerCase();
              onValidate({ valid: isCorrect, error: isCorrect ? '' : `Respuesta correcta: ${expected}` }, mutated);
              if (isCorrect) {
                setShowOriginal(true);
              }
            }}
            disabled={!mutated}
          >
            Validar mutación
          </GradientButton>

          {showOriginal && (
            <GlassCard className="bg-success/10 border-success/20">
              <p className="text-sm text-success font-medium text-center">
                ¡Correcto! La forma {targetMode === 'negative' ? 'negativa' : 'interrogativa'} es válida.
              </p>
            </GlassCard>
          )}
        </>
      )}
    </div>
  );
}

// Combination Mode
function CombinationMode({ onValidate }) {
  const [sentence1, setSentence1] = useState('');
  const [sentence2, setSentence2] = useState('');
  const [selectedConnector, setSelectedConnector] = useState('');

  const handleNewSentences = () => {
    setSentence1(generateRandomSentence());
    setSentence2(generateRandomSentence());
    setSelectedConnector('');
  };

  return (
    <div className="space-y-4">
      <GradientButton variant="ghost" className="w-full" onClick={handleNewSentences}>
        <div className="flex items-center justify-center gap-2">
          <RotateCcw className="w-4 h-4" />
          <span>{sentence1 ? "Nuevas frases" : "Generar frases"}</span>
        </div>
      </GradientButton>

      {sentence1 && (
        <>
          <GlassCard className="bg-bg-secondary">
            <p className="text-xs text-text-secondary mb-1">Frase 1:</p>
            <div className="flex items-center justify-between">
              <p className="font-mono text-text">{sentence1}</p>
              <button onClick={() => speak(sentence1)} className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-smooth">
                <Volume2 className="w-3 h-3 text-primary" />
              </button>
            </div>
          </GlassCard>

          <div className="flex flex-wrap gap-2 justify-center">
            {connectors.map(c => (
              <button
                key={c}
                onClick={() => setSelectedConnector(c)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-smooth",
                  selectedConnector === c 
                    ? "bg-primary text-white shadow-md" 
                    : "bg-bg-secondary text-text-secondary hover:bg-bg-tertiary"
                )}
              >
                {c}
              </button>
            ))}
          </div>

          <GlassCard className="bg-bg-secondary">
            <p className="text-xs text-text-secondary mb-1">Frase 2:</p>
            <div className="flex items-center justify-between">
              <p className="font-mono text-text">{sentence2}</p>
              <button onClick={() => speak(sentence2)} className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-smooth">
                <Volume2 className="w-3 h-3 text-primary" />
              </button>
            </div>
          </GlassCard>

          {selectedConnector && (
            <GlassCard className="bg-primary/5 border-primary/20">
              <p className="text-sm text-text-secondary mb-1">Resultado:</p>
              <div className="flex items-center justify-center gap-2">
                <p className="font-mono text-lg font-semibold text-primary">
                  {sentence1} {selectedConnector} {sentence2}
                </p>
                <button onClick={() => speak(`${sentence1} ${selectedConnector} ${sentence2}`)} className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-smooth">
                  <Volume2 className="w-3 h-3 text-primary" />
                </button>
              </div>
            </GlassCard>
          )}

          <GradientButton
            variant="primary"
            className="w-full"
            onClick={() => {
              const result = validateCombination(sentence1, selectedConnector, sentence2);
              onValidate(result, `${sentence1} ${selectedConnector} ${sentence2}`);
            }}
            disabled={!selectedConnector}
          >
            Validar combinación
          </GradientButton>
        </>
      )}
    </div>
  );
}

// Slang Mode
function SlangMode({ onValidate }) {
  const [current, setCurrent] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);

  const handleNew = () => {
    const random = informalExpressions[Math.floor(Math.random() * informalExpressions.length)];
    setCurrent(random);
    setUserAnswer('');
    setShowResult(false);
  };

  return (
    <div className="space-y-4">
      <GradientButton variant="ghost" className="w-full" onClick={handleNew}>
        <div className="flex items-center justify-center gap-2">
          <RotateCcw className="w-4 h-4" />
          <span>{current ? "Nueva expresión" : "Empezar"}</span>
        </div>
      </GradientButton>

      {current && (
        <>
          <GlassCard className="text-center">
            <p className="text-sm text-text-secondary mb-2">¿Cómo se dice formalmente?</p>
            <div className="flex items-center justify-center gap-3">
              <p className="text-2xl font-bold text-text">"{current.expression}"</p>
              <button onClick={() => speak(current.expression)} className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-smooth">
                <Volume2 className="w-4 h-4 text-primary" />
              </button>
            </div>
            <p className="text-sm text-text-secondary mt-2">Meaning: {current.meaning}</p>
          </GlassCard>

          {!showResult ? (
            <>
              <input
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Escribe la forma formal..."
                className="w-full bg-bg border border-border rounded-xl px-4 py-3 text-text placeholder-text-secondary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-smooth"
              />
              <GradientButton
                variant="primary"
                className="w-full"
                onClick={() => setShowResult(true)}
                disabled={!userAnswer}
              >
                Verificar
              </GradientButton>
            </>
          ) : (
            <GlassCard className={cn(
              "text-center",
              userAnswer.toLowerCase().trim() === current.formal.toLowerCase().trim()
                ? "bg-success/10 border-success/20"
                : "bg-error/10 border-error/20"
            )}>
              <div className="flex items-center justify-center gap-2">
                <p className="font-bold text-lg text-text">"{current.formal}"</p>
                <button onClick={() => speak(current.formal)} className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-smooth">
                  <Volume2 className="w-3 h-3 text-primary" />
                </button>
              </div>
              <p className="text-sm text-text-secondary mt-1">
                {userAnswer.toLowerCase().trim() === current.formal.toLowerCase().trim()
                  ? "¡Correcto!"
                  : "La respuesta correcta es arriba"
                }
              </p>
            </GlassCard>
          )}
        </>
      )}
    </div>
  );
}

// Pronunciation Mode
function PronunciationMode({ onValidate }) {
  const [current, setCurrent] = useState(null);
  const [showTip, setShowTip] = useState(false);

  const handleNew = () => {
    const random = pronunciationTips[Math.floor(Math.random() * pronunciationTips.length)];
    setCurrent(random);
    setShowTip(false);
  };

  return (
    <div className="space-y-4">
      <GradientButton variant="ghost" className="w-full" onClick={handleNew}>
        <div className="flex items-center justify-center gap-2">
          <RotateCcw className="w-4 h-4" />
          <span>{current ? "Nueva palabra" : "Empezar"}</span>
        </div>
      </GradientButton>

      {current && (
        <>
          <GlassCard className="text-center">
            <p className="text-sm text-text-secondary mb-2">¿Cómo se pronuncia?</p>
            <div className="flex items-center justify-center gap-3">
              <p className="text-3xl font-bold text-text font-mono">{current.word}</p>
              <button onClick={() => speak(current.word)} className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-smooth">
                <Volume2 className="w-5 h-5 text-primary" />
              </button>
            </div>
          </GlassCard>

          <GradientButton variant="primary" className="w-full" onClick={() => speak(current.word)}>
            <div className="flex items-center justify-center gap-2">
              <Volume2 className="w-5 h-5" />
              <span>Escuchar pronunciación</span>
            </div>
          </GradientButton>

          {!showTip ? (
            <GradientButton variant="ghost" className="w-full" onClick={() => setShowTip(true)}>
              <div className="flex items-center justify-center gap-2">
                <Lightbulb className="w-5 h-5" />
                <span>Mostrar truco</span>
              </div>
            </GradientButton>
          ) : (
            <GlassCard className="bg-warning/10 border-warning/20">
              <div className="flex items-center justify-between">
                <p className="font-bold text-text">{current.trick}</p>
                <button onClick={() => speak(current.trick)} className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-smooth">
                  <Volume2 className="w-3 h-3 text-primary" />
                </button>
              </div>
              <p className="text-sm text-text-secondary mt-1">{current.rule}</p>
            </GlassCard>
          )}
        </>
      )}
    </div>
  );
}

// Listen & Build Mode
function ListenBuildMode({ onValidate }) {
  const [currentPhrase, setCurrentPhrase] = useState(null);
  const [selectedWords, setSelectedWords] = useState([]);
  const [availableWords, setAvailableWords] = useState([]);
  const [showHint, setShowHint] = useState(false);
  const [heard, setHeard] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const phrases = getAllListenBuildPhrases();

  const handleNewPhrase = () => {
    const phrase = phrases[Math.floor(Math.random() * phrases.length)];
    setCurrentPhrase(phrase);
    setSelectedWords([]);
    setAvailableWords(shuffle(phrase.en.split(' ')));
    setShowHint(false);
    setHeard(false);
    setIsPlaying(false);
  };

  const handleListen = async () => {
    if (!currentPhrase || isPlaying) return;
    setIsPlaying(true);
    setHeard(true);
    try {
      await speakGoogleTTS(currentPhrase.en, 'en');
    } catch (e) {
      // Fallback: use local Web Speech API
      if (window.speechSynthesis) {
        const utt = new SpeechSynthesisUtterance(currentPhrase.en);
        utt.lang = 'en-US';
        utt.rate = 0.85;
        window.speechSynthesis.speak(utt);
        await new Promise(r => setTimeout(r, currentPhrase.en.length * 120 + 2000));
      }
    }
    setIsPlaying(false);
  };

  const handleSelectWord = (word, index) => {
    setSelectedWords(prev => [...prev, word]);
    setAvailableWords(prev => prev.filter((_, i) => i !== index));
  };

  const handleRemoveWord = (index) => {
    const word = selectedWords[index];
    setAvailableWords(prev => [...prev, word]);
    setSelectedWords(prev => prev.filter((_, i) => i !== index));
  };

  const handleCheck = () => {
    const userSentence = selectedWords.join(' ');
    const isCorrect = userSentence.toLowerCase().trim() === currentPhrase.en.toLowerCase().trim();
    onValidate({ valid: isCorrect, error: isCorrect ? '' : `Frase correcta: ${currentPhrase.en}` }, userSentence);
    if (isCorrect) {
      setSelectedWords([]);
      setAvailableWords([]);
    }
  };

  const handleClear = () => {
    setAvailableWords(prev => [...prev, ...selectedWords].sort(() => Math.random() - 0.5));
    setSelectedWords([]);
  };

  return (
    <div className="space-y-4">
      <GlassCard className="text-center bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border-cyan-200/30">
        <Headphones className="w-12 h-12 mx-auto text-cyan-500 mb-2" />
        <p className="font-bold text-text text-lg">Escucha y Construye</p>
        <p className="text-sm text-text-secondary">Escucha la frase en ingles y reconstruyela con las palabras</p>
      </GlassCard>

      <GradientButton variant="ghost" className="w-full" onClick={handleNewPhrase}>
        <div className="flex items-center justify-center gap-2">
          <RotateCcw className="w-4 h-4" />
          <span>{currentPhrase ? "Nueva frase" : "Empezar a escuchar"}</span>
        </div>
      </GradientButton>

      {currentPhrase && (
        <>
          <GradientButton
            variant="primary"
            className="w-full"
            onClick={handleListen}
            disabled={isPlaying}
          >
            <div className="flex items-center justify-center gap-2">
              {isPlaying ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Volume2 className="w-5 h-5" />
              )}
              <span>{isPlaying ? 'Reproduciendo...' : heard ? 'Volver a escuchar' : 'Escuchar frase'}</span>
            </div>
          </GradientButton>

          {showHint && (
            <GlassCard className="bg-warning/10 border-warning/20 text-center">
              <p className="text-sm text-text-secondary mb-1">Pista - Frase en ingles:</p>
              <p className="font-bold text-text text-lg">{currentPhrase.en}</p>
              <p className="text-sm text-text-secondary mt-2">Traduccion:</p>
              <p className="font-medium text-text">{currentPhrase.es}</p>
            </GlassCard>
          )}

          <GlassCard className="bg-bg-secondary border-2 border-dashed border-border min-h-[80px]">
            <p className="text-xs text-text-secondary mb-2 font-medium">Tu respuesta:</p>
            <div className="flex flex-wrap gap-2">
              {selectedWords.length === 0 ? (
                <p className="text-text-secondary text-sm italic">Toca las palabras para construir la frase...</p>
              ) : (
                selectedWords.map((word, i) => (
                  <button
                    key={i}
                    onClick={() => handleRemoveWord(i)}
                    className="px-3 py-2 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/80 active:scale-95 transition-all shadow-sm"
                  >
                    {word} ✕
                  </button>
                ))
              )}
            </div>
          </GlassCard>

          <GlassCard className="bg-bg">
            <p className="text-xs text-text-secondary mb-2 font-medium">Palabras disponibles:</p>
            <div className="flex flex-wrap gap-2">
              {availableWords.map((word, i) => (
                <button
                  key={`${word}-${i}`}
                  onClick={() => handleSelectWord(word, i)}
                  className="px-4 py-2.5 bg-bg-secondary border border-border rounded-xl text-text font-medium hover:border-primary hover:bg-primary/5 active:scale-95 transition-all shadow-sm"
                >
                  {word}
                </button>
              ))}
            </div>
          </GlassCard>

          <div className="flex gap-2">
            <GradientButton variant="ghost" className="flex-1" onClick={handleClear} disabled={selectedWords.length === 0}>
              <div className="flex items-center justify-center gap-1">
                <RotateCcw className="w-4 h-4" />
                <span>Limpiar</span>
              </div>
            </GradientButton>
            <GradientButton variant="outline" className="flex-1" onClick={() => setShowHint(!showHint)}>
              <div className="flex items-center justify-center gap-1">
                <Lightbulb className="w-4 h-4" />
                <span>Pista</span>
              </div>
            </GradientButton>
            <GradientButton variant="primary" className="flex-1" onClick={handleCheck} disabled={selectedWords.length === 0}>
              <div className="flex items-center justify-center gap-1">
                <Check className="w-4 h-4" />
                <span>Verificar</span>
              </div>
            </GradientButton>
          </div>
        </>
      )}
    </div>
  );
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Main Practice Component
export default function Practice({ mode, gameState, onBack }) {
  const [feedback, setFeedback] = useState(null);
  const [newAchievement, setNewAchievement] = useState(null);

  const handleValidate = useCallback((result, sentence) => {
    if (result.valid) {
      const points = gameState.addPoints(10, mode, true, 0);
      setFeedback({ correct: true, message: `¡Correcto! +${points} puntos`, sentence });
    } else {
      gameState.addPoints(0, mode, false, 0);
      setFeedback({ correct: false, message: result.error });
    }
  }, [gameState, mode]);

  const renderMode = () => {
    switch (mode) {
      case 'construction':
        return <ConstructionMode onValidate={handleValidate} />;
      case 'mutation':
        return <MutationMode onValidate={handleValidate} />;
      case 'combination':
        return <CombinationMode onValidate={handleValidate} />;
      case 'slang':
        return <SlangMode onValidate={handleValidate} />;
      case 'pronunciation':
        return <PronunciationMode onValidate={handleValidate} />;
      case 'listenbuild':
        return <ListenBuildMode onValidate={handleValidate} />;
      default:
        return <ConstructionMode onValidate={handleValidate} />;
    }
  };

  const modeNames = {
    construction: 'Construcción',
    mutation: 'Mutación',
    combination: 'Combinación',
    slang: 'Slang',
    pronunciation: 'Pronunciación',
    listenbuild: 'Escuchar y Construir',
  };

  return (
    <div className="p-6 space-y-4 animate-fade-in">
      <AchievementToast achievementId={newAchievement} onDismiss={() => setNewAchievement(null)} />

      <div className="flex items-center gap-4 animate-fade-in-down">
        <button 
          onClick={onBack} 
          className="w-10 h-10 rounded-xl bg-bg-secondary flex items-center justify-center hover:bg-bg-tertiary transition-smooth"
        >
          <ArrowLeft className="w-5 h-5 text-text-secondary" />
        </button>
        <h2 className="text-xl font-bold text-text">{modeNames[mode] || mode}</h2>
      </div>

      {feedback && (
        <GlassCard className={cn(
          "flex items-center gap-3 animate-scale-in",
          feedback.correct ? "bg-success/10 border-success/20" : "bg-error/10 border-error/20 animate-shake"
        )}>
          {feedback.correct ? (
            <Check className="w-5 h-5 text-success flex-shrink-0" />
          ) : (
            <X className="w-5 h-5 text-error flex-shrink-0" />
          )}
          <p className={cn(
            "text-sm font-medium flex-1",
            feedback.correct ? "text-success" : "text-error"
          )}>
            {feedback.message}
          </p>
          <button
            onClick={() => setFeedback(null)}
            className="text-text-tertiary hover:text-text-secondary transition-smooth"
          >
            <X className="w-4 h-4" />
          </button>
        </GlassCard>
      )}

      {feedback?.correct && feedback.sentence && (
        <div className="animate-fade-in-up">
          <AudioControls sentence={feedback.sentence} />
        </div>
      )}

      <div className="animate-fade-in-up">
        {renderMode()}
      </div>
    </div>
  );
}
