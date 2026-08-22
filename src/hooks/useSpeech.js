import { useState, useCallback, useRef, useEffect } from 'react';
import { translations, sentenceTranslations } from '../data/languageData';

export function useSpeech() {
  const [speaking, setSpeaking] = useState(false);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(() => {
    return localStorage.getItem('eng_voice') || '';
  });
  const [selectedSpanishVoice, setSelectedSpanishVoice] = useState(() => {
    return localStorage.getItem('es_voice') || '';
  });
  const utteranceRef = useRef(null);

  useEffect(() => {
    const loadVoices = () => {
      setVoices(window.speechSynthesis?.getVoices() || []);
    };
    loadVoices();
    window.speechSynthesis?.addEventListener('voiceschanged', loadVoices);
    return () => window.speechSynthesis?.removeEventListener('voiceschanged', loadVoices);
  }, []);

  const changeVoice = useCallback((voiceName) => {
    setSelectedVoice(voiceName);
    localStorage.setItem('eng_voice', voiceName);
  }, []);

  const changeSpanishVoice = useCallback((voiceName) => {
    setSelectedSpanishVoice(voiceName);
    localStorage.setItem('es_voice', voiceName);
  }, []);

  const getVoiceForLang = useCallback((lang) => {
    if (lang.startsWith('es')) {
      if (selectedSpanishVoice) {
        const v = voices.find(v => v.name === selectedSpanishVoice);
        if (v) return v;
      }
      return voices.find(v => v.lang.startsWith('es'));
    }
    if (selectedVoice) {
      const v = voices.find(v => v.name === selectedVoice);
      if (v) return v;
    }
    return voices.find(v => v.lang.startsWith('en'));
  }, [selectedVoice, selectedSpanishVoice, voices]);

  const speak = useCallback((text, lang = "en-US", rate = 1.0) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = rate;
    utterance.pitch = 1.0;

    const voice = getVoiceForLang(lang);
    if (voice) utterance.voice = voice;

    utteranceRef.current = utterance;
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(utterance);
  }, [getVoiceForLang]);

  const speakBilingual = useCallback((englishText, rate = 1.0) => {
    const spanishText = sentenceTranslations[englishText] ||
      englishText.split(" ").map(w => translations[w] || w).join(" ");

    speak(englishText, "en-US", rate);

    setTimeout(() => {
      speak(spanishText, "es-ES", rate);
    }, englishText.length * 80 + 500);
  }, [speak]);

  const stop = useCallback(() => {
    window.speechSynthesis?.cancel();
    setSpeaking(false);
  }, []);

  const englishVoices = voices.filter(v => v.lang.startsWith('en'));
  const spanishVoices = voices.filter(v => v.lang.startsWith('es'));

  return {
    speak, speakBilingual, stop, speaking,
    voices: englishVoices, selectedVoice, changeVoice,
    spanishVoices, selectedSpanishVoice, changeSpanishVoice
  };
}
