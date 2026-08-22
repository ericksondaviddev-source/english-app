import { useStorage } from './useStorage';

const LEVELS = [
  { level: 1, required: 0, name: "Principiante" },
  { level: 2, required: 100, name: "Aprendiz" },
  { level: 3, required: 300, name: "Practicante" },
  { level: 4, required: 600, name: "Hablante" },
  { level: 5, required: 1000, name: "Dominante" },
  { level: 6, required: 1500, name: "Experto" },
  { level: 7, required: 2500, name: "Maestro" },
  { level: 8, required: 5000, name: "Leyenda" },
];

function calculateLevel(points) {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (points >= LEVELS[i].required) return LEVELS[i];
  }
  return LEVELS[0];
}

export function useGameState() {
  const [points, setPoints] = useStorage("eng_points", 0);
  const [totalCorrect, setTotalCorrect] = useStorage("eng_totalCorrect", 0);
  const [streak, setStreak] = useStorage("eng_streak", 0);
  const [lastPlayDate, setLastPlayDate] = useStorage("eng_lastPlayDate", null);
  const [achievements, setAchievements] = useStorage("eng_achievements", []);
  const [records, setRecords] = useStorage("eng_records", {
    construction: null, mutation: null, combination: null
  });
  const [history, setHistory] = useStorage("eng_history", []);

  const level = calculateLevel(points);

  function addPoints(amount, mode, correct, time) {
    const today = new Date().toISOString().split("T")[0];
    const isNewDay = lastPlayDate !== today;
    
    let newStreak = streak;
    if (isNewDay) {
      const lastDate = lastPlayDate ? new Date(lastPlayDate) : null;
      const todayDate = new Date(today);
      const diffDays = lastDate ? Math.floor((todayDate - lastDate) / (1000 * 60 * 60 * 24)) : 999;
      newStreak = diffDays <= 1 ? streak + 1 : 1;
      setStreak(newStreak);
      setLastPlayDate(today);
    }

    let bonus = 0;
    if (correct) bonus += 5;
    if (newStreak >= 5) bonus += 20;

    const total = amount + bonus;
    setPoints(p => p + total);
    setTotalCorrect(c => c + (correct ? 1 : 0));

    const entry = { mode, correct, time, date: today, points: total };
    setHistory(h => [entry, ...h].slice(0, 50));

    checkAchievements(newStreak, correct);
    return total;
  }

  function checkAchievements(currentStreak, correct) {
    const newAchievements = [...achievements];
    const add = (id) => { if (!newAchievements.includes(id)) newAchievements.push(id); };

    if (correct) add("first_sentence");
    if (totalCorrect >= 10) add("10_correct");
    if (currentStreak >= 7) add("streak_7");
    if (currentStreak >= 30) add("streak_30");

    if (newAchievements.length > achievements.length) {
      setAchievements(newAchievements);
    }
  }

  function updateRecord(mode, time) {
    setRecords(r => {
      const current = r[mode];
      if (current === null || time < current) {
        return { ...r, [mode]: time };
      }
      return r;
    });
  }

  function resetProgress() {
    setPoints(0);
    setTotalCorrect(0);
    setStreak(0);
    setLastPlayDate(null);
    setAchievements([]);
    setRecords({ construction: null, mutation: null, combination: null });
    setHistory([]);
  }

  return {
    points, level, streak, achievements, records, history,
    addPoints, updateRecord, resetProgress, totalCorrect
  };
}