import { useState } from 'react';
import { courseModules } from '../data/courseData';
import { useStorage } from '../hooks/useStorage';
import AudioControls from './AudioControls';

function LessonContent({ content }) {
  return (
    <div className="space-y-4">
      {content.map((item, i) => {
        if (item.type === "text") {
          return <p key={i} className="text-text leading-relaxed">{item.value}</p>;
        }
        if (item.type === "list") {
          return (
            <ul key={i} className="space-y-1">
              {item.items.map((li, j) => (
                <li key={j} className="text-text flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>{li}
                </li>
              ))}
            </ul>
          );
        }
        if (item.type === "tip") {
          return (
            <div key={i} className="bg-warning/10 border border-warning/30 rounded-xl p-3">
              <p className="text-text text-sm">💡 {item.value}</p>
            </div>
          );
        }
        if (item.type === "table") {
          return (
            <div key={i} className="overflow-x-auto">
              <table className="w-full text-sm border border-border rounded-xl overflow-hidden">
                <thead>
                  <tr className="bg-bg-secondary">
                    {item.headers.map((h, j) => (
                      <th key={j} className="px-3 py-2 text-left font-semibold text-text border-b border-border">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {item.rows.map((row, j) => (
                    <tr key={j} className="border-b border-border last:border-0">
                      {row.map((cell, k) => (
                        <td key={k} className="px-3 py-2 text-text">{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }
        if (item.type === "audio") {
          return (
            <div key={i} className="bg-bg-secondary rounded-xl p-3">
              <AudioControls sentence={item.text} />
            </div>
          );
        }
        if (item.type === "video") {
          return (
            <div key={i} className="bg-bg-secondary rounded-xl p-3">
              <p className="text-sm text-text-secondary mb-2">🎬 Video:</p>
              <AudioControls sentence={item.sentence} />
            </div>
          );
        }
        return null;
      })}
    </div>
  );
}

function PracticeExercise({ exercise, isCorrect, onVerify }) {
  const [input, setInput] = useState("");

  const handleVerify = () => {
    onVerify(input.trim().toLowerCase() === exercise.answer.trim().toLowerCase());
  };

  return (
    <div className={`rounded-xl p-4 border transition-colors ${isCorrect === true ? "bg-success/10 border-success/30" : isCorrect === false ? "bg-error/10 border-error/30" : "bg-bg-secondary border-border"}`}>
      <p className="text-text font-medium mb-2">
        {exercise.type === "match" ? `¿Cómo se dice "${exercise.question}" en español?` : exercise.question}
      </p>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe tu respuesta..."
          className="flex-1 px-3 py-2 bg-bg border border-border rounded-lg text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          onKeyDown={(e) => e.key === "Enter" && handleVerify()}
        />
        <button
          onClick={handleVerify}
          disabled={isCorrect === true}
          className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          Verificar
        </button>
      </div>
      {isCorrect === true && <p className="text-success text-sm mt-2 font-medium">✓ ¡Correcto!</p>}
      {isCorrect === false && <p className="text-error text-sm mt-2">✗ Incorrecto. La respuesta era: <strong>{exercise.answer}</strong></p>}
    </div>
  );
}

function LessonView({ lesson, onComplete }) {
  const [showPractice, setShowPractice] = useState(false);
  const [answers, setAnswers] = useState({});
  const allCorrect = showPractice && lesson.practice.every((_, i) => answers[i] === true);

  const handleVerify = (index, correct) => {
    setAnswers(prev => ({ ...prev, [index]: correct }));
  };

  return (
    <div className="space-y-6">
      <div className="bg-bg-secondary rounded-2xl p-4">
        <LessonContent content={lesson.content} />
      </div>

      {!showPractice && (
        <button
          onClick={() => setShowPractice(true)}
          className="w-full bg-primary text-white rounded-2xl py-3 font-bold hover:bg-primary/90 active:scale-[0.98] transition-all"
        >
          Practicar
        </button>
      )}

      {showPractice && (
        <>
          <div className="space-y-3">
            {lesson.practice.map((exercise, i) => (
              <PracticeExercise
                key={i}
                exercise={exercise}
                isCorrect={answers[i]}
                onVerify={(correct) => handleVerify(i, correct)}
              />
            ))}
          </div>

          {allCorrect && (
            <button
              onClick={onComplete}
              className="w-full bg-success text-white rounded-2xl py-3 font-bold hover:bg-success/90 active:scale-[0.98] transition-all"
            >
              Completar
            </button>
          )}
        </>
      )}
    </div>
  );
}

export default function CourseView({ gameState, onBack }) {
  const [completedLessons, setCompletedLessons] = useStorage("courseCompleted", []);
  const [selectedModule, setSelectedModule] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);

  const markComplete = (lessonId) => {
    if (!completedLessons.includes(lessonId)) {
      setCompletedLessons([...completedLessons, lessonId]);
    }
  };

  if (selectedLesson) {
    return (
      <div className="p-4 space-y-4">
        <button
          onClick={() => setSelectedLesson(null)}
          className="text-primary text-sm font-medium flex items-center gap-1"
        >
          ← Volver a lecciones
        </button>
        <h2 className="text-xl font-bold text-text">{selectedLesson.title}</h2>
        <LessonView lesson={selectedLesson} onComplete={() => {
          markComplete(selectedLesson.id);
          setSelectedLesson(null);
        }} />
      </div>
    );
  }

  if (selectedModule) {
    return (
      <div className="p-4 space-y-4">
        <button
          onClick={() => setSelectedModule(null)}
          className="text-primary text-sm font-medium flex items-center gap-1"
        >
          ← Volver a módulos
        </button>
        <div className="flex items-center gap-2">
          <span className="text-2xl">{selectedModule.icon}</span>
          <h2 className="text-xl font-bold text-text">{selectedModule.title}</h2>
        </div>
        <p className="text-text-secondary">{selectedModule.description}</p>

        <div className="space-y-2">
          {selectedModule.lessons.map((lesson) => {
            const done = completedLessons.includes(lesson.id);
            return (
              <button
                key={lesson.id}
                onClick={() => setSelectedLesson(lesson)}
                className={`w-full text-left rounded-2xl p-4 border transition-all hover:scale-[1.01] ${done ? "bg-success/10 border-success/30" : "bg-bg-secondary border-border hover:border-primary/50"}`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-text">{lesson.title}</h3>
                    <p className="text-sm text-text-secondary">{lesson.practice.length} ejercicios</p>
                  </div>
                  {done && <span className="text-success text-xl">✓</span>}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="text-primary text-sm font-medium flex items-center gap-1"
        >
          ← Volver
        </button>
        <h1 className="text-2xl font-bold text-text">Curso de Inglés</h1>
      </div>
      <p className="text-text-secondary">
        {completedLessons.length} lecciones completadas
      </p>

      <div className="space-y-3">
        {courseModules.map((mod) => {
          const total = mod.lessons.length;
          const done = mod.lessons.filter(l => completedLessons.includes(l.id)).length;
          return (
            <button
              key={mod.id}
              onClick={() => setSelectedModule(mod)}
              className="w-full text-left bg-bg-secondary border border-border rounded-2xl p-4 hover:border-primary/50 hover:scale-[1.01] transition-all"
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">{mod.icon}</span>
                <div className="flex-1">
                  <h3 className="font-bold text-text">{mod.title}</h3>
                  <p className="text-sm text-text-secondary">{mod.description}</p>
                  <div className="mt-2 h-1.5 bg-border rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${(done / total) * 100}%` }}
                    />
                  </div>
                </div>
                <span className="text-sm text-text-secondary">{done}/{total}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
