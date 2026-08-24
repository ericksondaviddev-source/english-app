import { useState } from 'react';
import { ArrowLeft, Check, BookOpen, GraduationCap, Lightbulb } from 'lucide-react';
import { cn } from '../utils/cn';
import GlassCard from './base/GlassCard';
import GradientButton from './base/GradientButton';
import IconBadge from './base/IconBadge';
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
            <ul key={i} className="space-y-2">
              {item.items.map((li, j) => (
                <li key={j} className="text-text flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-primary text-xs font-bold">•</span>
                  </span>
                  {li}
                </li>
              ))}
            </ul>
          );
        }
        if (item.type === "tip") {
          return (
            <GlassCard key={i} className="bg-warning/10 border-warning/30">
              <div className="flex items-start gap-2">
                <Lightbulb className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                <p className="text-text text-sm">{item.value}</p>
              </div>
            </GlassCard>
          );
        }
        if (item.type === "table") {
          return (
            <div key={i} className="overflow-x-auto">
              <table className="w-full text-sm border border-border rounded-xl overflow-hidden">
                <thead>
                  <tr className="bg-bg-secondary">
                    {item.headers.map((h, j) => (
                      <th key={j} className="px-4 py-3 text-left font-semibold text-text border-b border-border">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {item.rows.map((row, j) => (
                    <tr key={j} className="border-b border-border-light last:border-0 hover:bg-bg-secondary/50 transition-smooth">
                      {row.map((cell, k) => (
                        <td key={k} className="px-4 py-3 text-text">{cell}</td>
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
            <GlassCard key={i} className="bg-bg-secondary">
              <AudioControls sentence={item.text} />
            </GlassCard>
          );
        }
        if (item.type === "video") {
          return (
            <GlassCard key={i} className="bg-bg-secondary">
              <p className="text-sm text-text-secondary mb-2">Video:</p>
              <AudioControls sentence={item.sentence} />
            </GlassCard>
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
    <GlassCard className={cn(
      "transition-smooth",
      isCorrect === true && "bg-success/10 border-success/30",
      isCorrect === false && "bg-error/10 border-error/30"
    )}>
      <p className="text-text font-medium mb-3">
        {exercise.type === "match" ? `¿Cómo se dice "${exercise.question}" en español?` : exercise.question}
      </p>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe tu respuesta..."
          className="flex-1 px-4 py-3 bg-bg border border-border rounded-xl text-text text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-smooth"
          onKeyDown={(e) => e.key === "Enter" && handleVerify()}
        />
        <GradientButton
          variant="primary"
          onClick={handleVerify}
          disabled={isCorrect === true}
          className="px-4"
        >
          Verificar
        </GradientButton>
      </div>
      {isCorrect === true && (
        <div className="flex items-center gap-2 mt-3 text-success text-sm font-medium">
          <Check className="w-4 h-4" />
          ¡Correcto!
        </div>
      )}
      {isCorrect === false && (
        <p className="text-error text-sm mt-3">Incorrecto. La respuesta era: <strong>{exercise.answer}</strong></p>
      )}
    </GlassCard>
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
    <div className="space-y-6 animate-fade-in">
      <GlassCard className="bg-bg-secondary">
        <LessonContent content={lesson.content} />
      </GlassCard>

      {!showPractice && (
        <GradientButton variant="primary" className="w-full" onClick={() => setShowPractice(true)}>
          <div className="flex items-center justify-center gap-2">
            <BookOpen className="w-5 h-5" />
            <span>Practicar</span>
          </div>
        </GradientButton>
      )}

      {showPractice && (
        <>
          <div className="space-y-3 stagger-children">
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
            <GradientButton variant="success" className="w-full" onClick={onComplete}>
              <div className="flex items-center justify-center gap-2">
                <Check className="w-5 h-5" />
                <span>Completar</span>
              </div>
            </GradientButton>
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
      <div className="p-6 space-y-4 animate-fade-in">
        <button
          onClick={() => setSelectedLesson(null)}
          className="flex items-center gap-2 text-primary text-sm font-medium hover:text-primary-dark transition-smooth"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a lecciones
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
      <div className="p-6 space-y-4 animate-fade-in">
        <button
          onClick={() => setSelectedModule(null)}
          className="flex items-center gap-2 text-primary text-sm font-medium hover:text-primary-dark transition-smooth"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a módulos
        </button>
        <div className="flex items-center gap-3">
          <IconBadge icon={GraduationCap} variant="primary" size="lg" />
          <h2 className="text-xl font-bold text-text">{selectedModule.title}</h2>
        </div>
        <p className="text-text-secondary">{selectedModule.description}</p>

        <div className="space-y-3 stagger-children">
          {selectedModule.lessons.map((lesson) => {
            const done = completedLessons.includes(lesson.id);
            return (
              <GlassCard
                key={lesson.id}
                className={cn(
                  "cursor-pointer hover-lift",
                  done && "bg-success/10 border-success/30"
                )}
                onClick={() => setSelectedLesson(lesson)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-text">{lesson.title}</h3>
                    <p className="text-sm text-text-secondary">{lesson.practice.length} ejercicios</p>
                  </div>
                  {done && (
                    <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center">
                      <Check className="w-4 h-4 text-success" />
                    </div>
                  )}
                </div>
              </GlassCard>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-xl bg-bg-secondary flex items-center justify-center hover:bg-bg-tertiary transition-smooth"
        >
          <ArrowLeft className="w-5 h-5 text-text-secondary" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-text">Curso de Inglés</h1>
          <p className="text-text-secondary text-sm">
            {completedLessons.length} lecciones completadas
          </p>
        </div>
      </div>

      <div className="space-y-3 stagger-children">
        {courseModules.map((mod) => {
          const total = mod.lessons.length;
          const done = mod.lessons.filter(l => completedLessons.includes(l.id)).length;
          return (
            <GlassCard
              key={mod.id}
              className="cursor-pointer hover-lift"
              onClick={() => setSelectedModule(mod)}
            >
              <div className="flex items-center gap-4">
                <IconBadge icon={GraduationCap} variant="primary" />
                <div className="flex-1">
                  <h3 className="font-bold text-text">{mod.title}</h3>
                  <p className="text-sm text-text-secondary">{mod.description}</p>
                  <div className="mt-3 h-2 bg-bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-primary-light rounded-full transition-all duration-500"
                      style={{ width: `${(done / total) * 100}%` }}
                    />
                  </div>
                </div>
                <span className="text-sm text-text-secondary font-mono">{done}/{total}</span>
              </div>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
}
