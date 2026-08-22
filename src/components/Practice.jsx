import { useState, useCallback } from 'react';
import BlockSelector from './BlockSelector';
import SentencePreview from './SentencePreview';
import AudioControls from './AudioControls';
import AchievementToast from './AchievementToast';
import { validateConstruction, validateCombination, generateRandomSentence } from '../utils/sentenceValidator';
import { pronouns, verbs, objects, connectors, informalExpressions, pronunciationTips } from '../data/languageData';

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
      <SentencePreview words={selectedWords} onClear={handleClear} onRemoveWord={handleRemove} />
      <BlockSelector data={data} onSelect={handleSelect} selected={selectedWords} />
      <button
        onClick={() => {
          const result = validateConstruction(selectedWords);
          onValidate(result, selectedWords.join(" "));
          if (result.valid) setSelectedWords([]);
        }}
        disabled={selectedWords.length < 3}
        className="w-full bg-primary text-text-inverse rounded-xl py-3 font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 active:scale-[0.98] transition-all"
      >
        Validar frase
      </button>
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
      <button onClick={handleNewSentence} className="w-full bg-primary/10 text-primary rounded-xl py-2 font-medium">
        {sentence ? "🔄 Nueva frase" : "🎲 Generar frase"}
      </button>

      {sentence && (
        <>
          <div className="bg-bg-secondary border border-border rounded-xl p-4">
            <p className="text-sm text-text-secondary mb-1">Frase original:</p>
            <div className="flex items-center justify-between">
              <p className="font-mono text-lg font-semibold text-text">{sentence}</p>
              <button onClick={() => speak(sentence)} className="text-primary hover:text-primary/80 p-1">🔊</button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-bg-secondary border border-border rounded-xl p-3">
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs text-text-secondary">❌ Negativo</p>
                <button onClick={() => speak(negativeForm)} className="text-primary hover:text-primary/80 text-sm">🔊</button>
              </div>
              <p className="font-mono text-sm text-text">{negativeForm}</p>
            </div>
            <div className="bg-bg-secondary border border-border rounded-xl p-3">
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs text-text-secondary">❓ Pregunta</p>
                <button onClick={() => speak(questionForm)} className="text-primary hover:text-primary/80 text-sm">🔊</button>
              </div>
              <p className="font-mono text-sm text-text">{questionForm}</p>
            </div>
          </div>

          <div className="flex gap-2">
            {['negative', 'question'].map(m => (
              <button
                key={m}
                onClick={() => { setTargetMode(m); setMutated(''); setShowOriginal(false); }}
                className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${
                  targetMode === m ? 'bg-primary text-text-inverse' : 'bg-bg-secondary text-text-secondary'
                }`}
              >
                {m === 'negative' ? '❌ Negativo' : '❓ Pregunta'}
              </button>
            ))}
          </div>

          <input
            type="text"
            value={mutated}
            onChange={(e) => setMutated(e.target.value)}
            placeholder={targetMode === 'negative' ? 'Escribe la forma negativa...' : 'Escribe la pregunta...'}
            className="w-full bg-bg border border-border rounded-xl px-4 py-3 text-text placeholder-text-secondary focus:outline-none focus:border-primary"
          />

          <button
            onClick={() => {
              const expected = targetMode === 'negative' ? negativeForm : questionForm;
              const isCorrect = mutated.trim().toLowerCase() === expected.trim().toLowerCase();
              onValidate({ valid: isCorrect, error: isCorrect ? '' : `Respuesta correcta: ${expected}` }, mutated);
              if (isCorrect) {
                setShowOriginal(true);
              }
            }}
            disabled={!mutated}
            className="w-full bg-primary text-text-inverse rounded-xl py-3 font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 active:scale-[0.98] transition-all"
          >
            Validar mutación
          </button>

          {showOriginal && (
            <div className="bg-success/10 border border-success/20 rounded-xl p-3 text-sm text-success font-medium text-center">
              ¡Correcto! La forma {targetMode === 'negative' ? 'negativa' : 'interrogativa'} es válida.
            </div>
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
      <button onClick={handleNewSentences} className="w-full bg-primary/10 text-primary rounded-xl py-2 font-medium">
        {sentence1 ? "🔄 Nuevas frases" : "🎲 Generar frases"}
      </button>

      {sentence1 && (
        <>
          <div className="bg-bg-secondary border border-border rounded-xl p-3">
            <p className="text-xs text-text-secondary mb-1">Frase 1:</p>
            <div className="flex items-center justify-between">
              <p className="font-mono text-text">{sentence1}</p>
              <button onClick={() => speak(sentence1)} className="text-primary hover:text-primary/80 text-sm">🔊</button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 justify-center">
            {connectors.map(c => (
              <button
                key={c}
                onClick={() => setSelectedConnector(c)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  selectedConnector === c ? 'bg-primary text-text-inverse' : 'bg-bg-secondary text-text-secondary'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="bg-bg-secondary border border-border rounded-xl p-3">
            <p className="text-xs text-text-secondary mb-1">Frase 2:</p>
            <div className="flex items-center justify-between">
              <p className="font-mono text-text">{sentence2}</p>
              <button onClick={() => speak(sentence2)} className="text-primary hover:text-primary/80 text-sm">🔊</button>
            </div>
          </div>

          {selectedConnector && (
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-3 text-center">
              <p className="text-sm text-text-secondary mb-1">Resultado:</p>
              <div className="flex items-center justify-center gap-2">
                <p className="font-mono text-lg font-semibold text-primary">
                  {sentence1} {selectedConnector} {sentence2}
                </p>
                <button onClick={() => speak(`${sentence1} ${selectedConnector} ${sentence2}`)} className="text-primary hover:text-primary/80">🔊</button>
              </div>
            </div>
          )}

          <button
            onClick={() => {
              const result = validateCombination(sentence1, selectedConnector, sentence2);
              onValidate(result, `${sentence1} ${selectedConnector} ${sentence2}`);
            }}
            disabled={!selectedConnector}
            className="w-full bg-primary text-text-inverse rounded-xl py-3 font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 active:scale-[0.98] transition-all"
          >
            Validar combinación
          </button>
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
      <button onClick={handleNew} className="w-full bg-primary/10 text-primary rounded-xl py-2 font-medium">
        {current ? "🔄 Nueva expresión" : "🎲 Empezar"}
      </button>

      {current && (
        <>
          <div className="bg-bg-secondary border border-border rounded-xl p-4 text-center">
            <p className="text-sm text-text-secondary mb-2">¿Cómo se dice formalmente?</p>
            <div className="flex items-center justify-center gap-3">
              <p className="text-2xl font-bold text-text">"{current.expression}"</p>
              <button onClick={() => speak(current.expression)} className="text-primary hover:text-primary/80 text-xl">🔊</button>
            </div>
            <p className="text-sm text-text-secondary mt-2">Meaning: {current.meaning}</p>
          </div>

          {!showResult ? (
            <>
              <input
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Escribe la forma formal..."
                className="w-full bg-bg border border-border rounded-xl px-4 py-3 text-text placeholder-text-secondary focus:outline-none focus:border-primary"
              />
              <button
                onClick={() => setShowResult(true)}
                disabled={!userAnswer}
                className="w-full bg-primary text-text-inverse rounded-xl py-3 font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 active:scale-[0.98] transition-all"
              >
                Verificar
              </button>
            </>
          ) : (
            <div className={`rounded-xl p-4 text-center ${
              userAnswer.toLowerCase().trim() === current.formal.toLowerCase().trim()
                ? "bg-success/10 border border-success/20"
                : "bg-error/10 border border-error/20"
            }`}>
              <div className="flex items-center justify-center gap-2">
                <p className="font-bold text-lg text-text">"{current.formal}"</p>
                <button onClick={() => speak(current.formal)} className="text-primary hover:text-primary/80">🔊</button>
              </div>
              <p className="text-sm text-text-secondary mt-1">
                {userAnswer.toLowerCase().trim() === current.formal.toLowerCase().trim()
                  ? "¡Correcto! 🎉"
                  : "La respuesta correcta es arriba"
                }
              </p>
            </div>
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
      <button onClick={handleNew} className="w-full bg-primary/10 text-primary rounded-xl py-2 font-medium">
        {current ? "🔄 Nueva palabra" : "🎲 Empezar"}
      </button>

      {current && (
        <>
          <div className="bg-bg-secondary border border-border rounded-xl p-4 text-center">
            <p className="text-sm text-text-secondary mb-2">¿Cómo se pronuncia?</p>
            <div className="flex items-center justify-center gap-3">
              <p className="text-3xl font-bold text-text font-mono">{current.word}</p>
              <button onClick={() => speak(current.word)} className="text-primary hover:text-primary/80 text-xl">🔊</button>
            </div>
          </div>

          <button
            onClick={() => speak(current.word)}
            className="w-full bg-primary/10 text-primary rounded-xl py-3 font-medium"
          >
            🔊 Escuchar pronunciación
          </button>

          {!showTip ? (
            <button
              onClick={() => setShowTip(true)}
              className="w-full bg-bg-secondary text-text-secondary rounded-xl py-3 font-medium"
            >
              💡 Mostrar truco
            </button>
          ) : (
            <div className="bg-warning/10 border border-warning/20 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <p className="font-bold text-text">{current.trick}</p>
                <button onClick={() => speak(current.trick)} className="text-primary hover:text-primary/80 text-sm">🔊</button>
              </div>
              <p className="text-sm text-text-secondary mt-1">{current.rule}</p>
            </div>
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

  const phrases = Object.keys(sentenceTranslations);

  const handleNewPhrase = () => {
    const phrase = phrases[Math.floor(Math.random() * phrases.length)];
    setCurrentPhrase(phrase);
    setSelectedWords([]);
    setAvailableWords(shuffle(phrase.split(' ')));
    setShowHint(false);
    setHeard(false);
  };

  const handleListen = () => {
    if (!currentPhrase) return;
    speak(currentPhrase, 'en-US', 0.8);
    setHeard(true);
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
    const isCorrect = userSentence.toLowerCase().trim() === currentPhrase.toLowerCase().trim();
    onValidate({ valid: isCorrect, error: isCorrect ? '' : `Frase correcta: ${currentPhrase}` }, userSentence);
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
      <button onClick={handleNewPhrase} className="w-full bg-primary/10 text-primary rounded-xl py-2.5 font-medium">
        {currentPhrase ? "🔄 Nueva frase" : "🎧 Empezar a escuchar"}
      </button>

      {currentPhrase && (
        <>
          <button
            onClick={handleListen}
            className="w-full bg-primary text-white rounded-xl py-3 font-medium text-lg flex items-center justify-center gap-2 active:scale-[0.97] transition-all"
          >
            {heard ? "🔊 Volver a escuchar" : "🎧 Escuchar frase"}
          </button>

          {showHint && (
            <div className="bg-warning/10 border border-warning/20 rounded-xl p-3 text-center">
              <p className="text-sm text-text-secondary">Pista:</p>
              <p className="font-medium text-text">{currentPhrase}</p>
              <p className="text-sm text-text-secondary mt-1">{sentenceTranslations[currentPhrase]}</p>
            </div>
          )}

          <div className="bg-bg-secondary border border-border rounded-xl p-3 min-h-[60px]">
            <p className="text-xs text-text-secondary mb-2">Tu respuesta:</p>
            <div className="flex flex-wrap gap-2">
              {selectedWords.length === 0 ? (
                <p className="text-text-secondary text-sm italic">Toca las palabras para construir la frase...</p>
              ) : (
                selectedWords.map((word, i) => (
                  <button
                    key={i}
                    onClick={() => handleRemoveWord(i)}
                    className="px-3 py-1.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/80 active:scale-95 transition-all"
                  >
                    {word} ✕
                  </button>
                ))
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {availableWords.map((word, i) => (
              <button
                key={`${word}-${i}`}
                onClick={() => handleSelectWord(word, i)}
                className="px-4 py-2 bg-bg border border-border rounded-xl text-text font-medium hover:border-primary hover:bg-primary/5 active:scale-95 transition-all"
              >
                {word}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleClear}
              disabled={selectedWords.length === 0}
              className="flex-1 bg-bg-secondary text-text-secondary rounded-xl py-2.5 font-medium disabled:opacity-50"
            >
              ↺ Limpiar
            </button>
            <button
              onClick={() => setShowHint(!showHint)}
              className="flex-1 bg-warning/10 text-warning rounded-xl py-2.5 font-medium"
            >
              💡 Pista
            </button>
            <button
              onClick={handleCheck}
              disabled={selectedWords.length === 0}
              className="flex-1 bg-primary text-white rounded-xl py-2.5 font-bold disabled:opacity-50 active:scale-[0.97] transition-all"
            >
              ✓ Verificar
            </button>
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
    construction: '🧱 Construcción',
    mutation: '🔄 Mutación',
    combination: '🔗 Combinación',
    slang: '🗣️ Slang',
    pronunciation: '🎤 Pronunciación',
    listenbuild: '🎧 Escuchar y Construir',
  };

  return (
    <div className="p-4 space-y-4">
      <AchievementToast achievementId={newAchievement} onDismiss={() => setNewAchievement(null)} />

      <div className="flex items-center justify-between">
        <button onClick={onBack} className="text-text-secondary hover:text-text">
          ← Volver
        </button>
        <h2 className="font-bold text-text">{modeNames[mode] || mode}</h2>
        <div className="w-16" />
      </div>

      {feedback && (
        <div className={`relative p-3 rounded-xl text-sm font-medium ${
          feedback.correct
            ? "bg-success/10 text-success border border-success/20"
            : "bg-error/10 text-error border border-error/20"
        }`}>
          <button
            onClick={() => setFeedback(null)}
            className="absolute top-2 right-2 text-current opacity-60 hover:opacity-100 text-lg leading-none"
          >
            ✕
          </button>
          {feedback.message}
        </div>
      )}

      {feedback?.correct && feedback.sentence && (
        <AudioControls sentence={feedback.sentence} />
      )}

      {renderMode()}
    </div>
  );
}
