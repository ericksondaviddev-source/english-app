import { pronouns, verbs, connectors, contractions, informalExpressions } from '../data/languageData';

// Check if a word is a pronoun
export function isPronoun(word) {
  return pronouns.includes(word);
}

// Check if a word is a verb (any tense)
export function isVerb(word) {
  return Object.values(verbs).flat().includes(word);
}

// Check if a word is a connector
export function isConnector(word) {
  return connectors.includes(word);
}

// Validate S+V+O sentence structure
export function validateConstruction(selectedBlocks) {
  if (selectedBlocks.length < 3) return { valid: false, error: "Necesitas al menos 3 bloques: pronombre + verbo + objeto" };

  const [first, second] = selectedBlocks;

  if (!isPronoun(first)) return { valid: false, error: "La primera palabra debe ser un pronombre" };
  if (!isVerb(second)) return { valid: false, error: "La segunda palabra debe ser un verbo" };

  return { valid: true, sentence: selectedBlocks.join(" ") };
}

// Validate mutation (affirmative → negative/question)
export function validateMutation(original, mutated, targetMode) {
  const words = mutated.trim().toLowerCase().split(/\s+/);

  if (targetMode === "negative") {
    const hasNegation = words.some(w => w === "not" || w.endsWith("n't"));
    if (!hasNegation) return { valid: false, error: "La forma negativa debe incluir 'not' o una contracción negativa" };
    return { valid: true };
  }

  if (targetMode === "question") {
    const firstWord = words[0];
    const auxiliaries = ["do", "does", "did", "is", "are", "was", "were", "can", "will", "would"];
    if (!auxiliaries.includes(firstWord)) {
      return { valid: false, error: "La pregunta debe empezar con un verbo auxiliar (do, does, is, etc.)" };
    }
    return { valid: true };
  }

  return { valid: false, error: "Modo de mutación no válido" };
}

// Validate combination (two sentences + connector)
export function validateCombination(sentence1, connector, sentence2) {
  if (!isConnector(connector)) return { valid: false, error: `"${connector}" no es un conector válido` };
  if (!sentence1 || !sentence2) return { valid: false, error: "Necesitas dos oraciones para combinar" };

  return { valid: true, sentence: `${sentence1} ${connector} ${sentence2}` };
}

// Check if a contraction is valid
export function findContractions(word) {
  return contractions.filter(c =>
    c.formal.toLowerCase() === word.toLowerCase() ||
    c.informal.toLowerCase() === word.toLowerCase()
  );
}

// Check if expression is informal
export function findInformalExpression(expression) {
  return informalExpressions.find(e =>
    e.expression.toLowerCase() === expression.toLowerCase()
  );
}

// Get Spanish translation for a word
export function translate(word, translations) {
  return translations[word] || word;
}

// Generate a random sentence for practice
export function generateRandomSentence() {
  const pronoun = pronouns[Math.floor(Math.random() * pronouns.length)];
  const verbList = verbs.present;
  const verb = verbList[Math.floor(Math.random() * verbList.length)];
  const object = ["water", "apples", "food", "music", "a book", "the truth", "something", "help"][Math.floor(Math.random() * 8)];
  return `${pronoun} ${verb} ${object}`;
}
