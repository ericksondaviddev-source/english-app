import { translations, sentenceTranslations, adjectives, adverbs, prepositions, expandedVerbs } from '../data/languageData';

const dictionary = {};
const sentenceDict = {};

function buildDictionary() {
  Object.entries(translations).forEach(([es, en]) => {
    dictionary[es.toLowerCase()] = en;
  });

  adjectives.forEach(({ es, en }) => {
    dictionary[es.toLowerCase()] = en;
  });

  adverbs.forEach(({ es, en }) => {
    dictionary[es.toLowerCase()] = en;
  });

  prepositions.forEach(({ es, en }) => {
    dictionary[es.toLowerCase()] = en;
  });

  Object.entries(expandedVerbs).forEach(([en, data]) => {
    if (data.es) {
      dictionary[data.es.toLowerCase()] = en;
    }
  });

  Object.entries(sentenceTranslations).forEach(([en, es]) => {
    sentenceDict[en.toLowerCase()] = es;
  });
}

buildDictionary();

export function offlineTranslate(text) {
  const lower = text.toLowerCase().trim();

  if (sentenceDict[lower]) return sentenceDict[lower];

  if (dictionary[lower]) return dictionary[lower];

  const words = lower.split(/\s+/);
  const translated = words.map(word => dictionary[word] || word);
  const result = translated.join(' ');

  if (result !== lower) return result;

  return null;
}

export async function googleTranslate(text, targetLang = 'es') {
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
    const response = await fetch(url);
    const data = await response.json();
    return data[0].map(item => item[0]).join('');
  } catch (error) {
    console.error('Google Translate error:', error);
    return null;
  }
}

export async function hybridTranslate(text) {
  const offlineResult = offlineTranslate(text);
  if (offlineResult) return { translation: offlineResult, source: 'offline' };

  const onlineResult = await googleTranslate(text);
  if (onlineResult) return { translation: onlineResult, source: 'google' };

  return { translation: text, source: 'none' };
}

export function getTranslationSource(text) {
  const lower = text.toLowerCase().trim();
  if (sentenceDict[lower]) return 'sentence';
  if (dictionary[lower]) return 'word';
  return 'none';
}
