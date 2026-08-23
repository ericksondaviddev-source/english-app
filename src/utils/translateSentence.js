import { hybridTranslate, offlineTranslate } from '../services/translationService';

export async function translateSentence(sentence) {
  const result = await hybridTranslate(sentence);
  return result.translation;
}

export function translateSentenceOffline(sentence) {
  return offlineTranslate(sentence);
}
