import { useState, useCallback, useRef, useEffect } from 'react';
import { getSpanishText } from '../services/translationService';

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
    return new Promise(resolve => {
      if (!window.speechSynthesis || !text) { resolve(); return; }
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = rate;
      utterance.pitch = 1.0;

      const voice = getVoiceForLang(lang);
      if (voice) utterance.voice = voice;

      utteranceRef.current = utterance;
      let done = false;
      const finish = () => {
        if (done) return;
        done = true;
        setSpeaking(false);
        resolve();
      };
      utterance.onstart = () => setSpeaking(true);
      utterance.onend = finish;
      utterance.onerror = finish;
      setTimeout(finish, text.length * 130 + 4000);
      window.speechSynthesis.speak(utterance);
    });
  }, [getVoiceForLang]);

  const speakBilingual = useCallback(async (englishText, rate = 1.0) => {
    // Fetch the Spanish translation while English plays (no added latency)
    const esPromise = getSpanishText(englishText);
    await speak(englishText, 'en-US', rate);
    const spanishText = await esPromise;
    if (spanishText) {
      await speak(spanishText, 'es-ES', rate);
    }
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
