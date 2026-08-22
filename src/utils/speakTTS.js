let cachedVoices = [];

if (typeof window !== 'undefined' && window.speechSynthesis) {
  const load = () => { cachedVoices = window.speechSynthesis.getVoices(); };
  load();
  window.speechSynthesis.addEventListener('voiceschanged', load);
}

function getVoiceForLang(lang) {
  if (lang.startsWith('es')) {
    const saved = localStorage.getItem('es_voice');
    if (saved) {
      const v = cachedVoices.find(v => v.name === saved);
      if (v) return v;
    }
    return cachedVoices.find(v => v.lang.startsWith('es'));
  }
  const saved = localStorage.getItem('eng_voice');
  if (saved) {
    const v = cachedVoices.find(v => v.name === saved);
    if (v) return v;
  }
  return cachedVoices.find(v => v.lang.startsWith('en'));
}

export function speakTTS(text, lang = 'en-US', rate = 0.9) {
  return new Promise(resolve => {
    if (!window.speechSynthesis) { resolve(); return; }
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = lang;
    utt.rate = rate;
    utt.pitch = 1.0;
    const voice = getVoiceForLang(lang);
    if (voice) utt.voice = voice;
    utt.onend = resolve;
    utt.onerror = resolve;
    setTimeout(resolve, text.length * 120 + 3000);
    window.speechSynthesis.speak(utt);
  });
}

export function stopTTS() {
  window.speechSynthesis?.cancel();
}
