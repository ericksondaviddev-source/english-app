import { translations, sentenceTranslations, adjectives, adverbs, prepositions, expandedVerbs } from '../data/languageData';
import { translateSentence } from '../utils/translateSentence';

const dictionary = {};
const sentenceDict = {};
const enToEs = {};

function buildDictionary() {
  Object.entries(translations).forEach(([en, es]) => {
    dictionary[en.toLowerCase()] = es;
    enToEs[es.toLowerCase()] = en;
  });

  adjectives.forEach(({ es, en }) => {
    dictionary[en.toLowerCase()] = es;
    enToEs[es.toLowerCase()] = en;
  });

  adverbs.forEach(({ es, en }) => {
    dictionary[en.toLowerCase()] = es;
  });

  prepositions.forEach(({ es, en }) => {
    dictionary[en.toLowerCase()] = es;
  });

  Object.entries(expandedVerbs).forEach(([en, data]) => {
    if (data.es) {
      dictionary[en.toLowerCase()] = data.es;
    }
  });

  Object.entries(sentenceTranslations).forEach(([en, es]) => {
    sentenceDict[en.toLowerCase()] = es;
  });
}

buildDictionary();

// Offline translation: exact matches or fully-translatable sentences only.
// NEVER returns a mixed-language result.
export function offlineTranslate(text) {
  const lower = text.toLowerCase().trim();
  if (!lower) return null;

  // 1. Exact sentence match
  if (sentenceDict[lower]) return sentenceDict[lower];

  // 2. Structured translation (conjugates verbs, no mixing)
  const structured = translateSentence(text);
  if (structured && structured !== text) {
    const origWords = lower.replace(/[.!?]+$/, '').split(/\s+/).filter(w => w.length >= 3);
    const unmixed = !origWords.some(w => structured.toLowerCase().includes(w));
    if (unmixed) return structured;
  }

  // 3. Full-phrase dictionary match
  if (dictionary[lower]) return dictionary[lower];

  // 4. Word-by-word ONLY if every single word translates
  const words = lower.replace(/[.!?]+$/, '').split(/\s+/);
  const translated = words.map(w => dictionary[w]);
  if (translated.every(Boolean)) return translated.join(' ');

  return null;
}

export async function googleTranslate(text, targetLang = 'es') {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 6000);
  try {
    // Primary: our serverless proxy (reliable, no rate limits)
    const resp = await fetch(`/api/translate?text=${encodeURIComponent(text)}&tl=${targetLang}`, {
      signal: controller.signal
    });
    if (resp.ok) {
      const data = await resp.json();
      if (data?.translation) return data.translation;
    }
    // Fallback: direct endpoint (works in browsers with real UA)
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) return null;
    const data = await response.json();
    const result = data?.[0]?.map(item => item?.[0] || '').join('');
    return result || null;
  } catch (error) {
    console.warn('Google Translate unavailable:', error.message);
    return null;
  } finally {
    clearTimeout(timer);
  }
}

// Offline first (fast, exact), Google for the rest. Never returns mixed garbage.
export async function hybridTranslate(text) {
  const offlineResult = offlineTranslate(text);
  if (offlineResult) return { translation: offlineResult, source: 'offline' };

  const onlineResult = await googleTranslate(text);
  if (onlineResult) return { translation: onlineResult, source: 'google' };

  return { translation: null, source: 'none' };
}

// Best Spanish translation for TTS/display. NEVER returns mixed language text.
// Chain: exact sentence -> structured (only if fully Spanish) -> Google Translate -> null
export async function getSpanishText(englishText) {
  if (!englishText) return null;
  const lower = englishText.toLowerCase().trim();

  if (sentenceDict[lower]) return sentenceDict[lower];

  const structured = translateSentence(englishText);
  if (structured && structured !== englishText) {
    const origWords = lower.replace(/[.!?]+$/, '').split(/\s+/).filter(w => w.length >= 3);
    const unmixed = !origWords.some(w => structured.toLowerCase().includes(w));
    if (unmixed) return structured;
  }

  const online = await googleTranslate(englishText);
  return online || null;
}

export function getTranslationSource(text) {
  const lower = text.toLowerCase().trim();
  if (sentenceDict[lower]) return 'sentence';
  if (dictionary[lower]) return 'word';
  return 'none';
}
