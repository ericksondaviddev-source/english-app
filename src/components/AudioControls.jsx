import { useState } from 'react';
import { useSpeech } from '../hooks/useSpeech';
import { useVideoExport } from '../hooks/useVideoExport';
import { translations, sentenceTranslations } from '../data/languageData';
import { webmBlobToMp3 } from '../utils/mp3Encoder';

async function captureTabAudio() {
  try {
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: { width: 1, height: 1 },
      audio: true
    });
    const audioTracks = stream.getAudioTracks();
    if (audioTracks.length === 0) {
      stream.getTracks().forEach(t => t.stop());
      return null;
    }
    stream.getVideoTracks().forEach(t => t.stop());
    return new MediaStream(audioTracks);
  } catch {
    return null;
  }
}

function playTTS(text, lang) {
  return new Promise(resolve => {
    if (!window.speechSynthesis) { resolve(); return; }
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = lang;
    utt.rate = 0.9;
    utt.onend = resolve;
    utt.onerror = resolve;
    setTimeout(resolve, text.length * 100 + 3000);
    window.speechSynthesis.speak(utt);
  });
}

export default function AudioControls({ sentence }) {
  const { speakBilingual, speaking, stop } = useSpeech();
  const { generateVideo, exporting, progress } = useVideoExport();
  const [recording, setRecording] = useState(false);

  const downloadAudio = async () => {
    setRecording(true);
    const audioStream = await captureTabAudio();
    if (!audioStream) {
      alert("No se pudo acceder al audio. Usa Chrome y acepta compartir pestaña.");
      setRecording(false);
      return;
    }

    const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
      ? 'audio/webm;codecs=opus' : 'audio/webm';
    const recorder = new MediaRecorder(audioStream, { mimeType });
    const chunks = [];

    recorder.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data); };
    recorder.onstop = async () => {
      try {
        const webmBlob = new Blob(chunks, { type: 'audio/webm' });
        const mp3Blob = await webmBlobToMp3(webmBlob);
        const url = URL.createObjectURL(mp3Blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `english-${Date.now()}.mp3`;
        a.click();
        URL.revokeObjectURL(url);
      } catch (err) {
        console.error("MP3 encoding failed:", err);
        // Fallback: download as webm
        const blob = new Blob(chunks, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `english-${Date.now()}.webm`;
        a.click();
        URL.revokeObjectURL(url);
      }
      audioStream.getTracks().forEach(t => t.stop());
      setRecording(false);
    };

    recorder.start();

    const spanishText = sentenceTranslations[sentence] ||
      sentence.split(" ").map(w => translations[w] || w).join(" ");

    await playTTS(sentence, "en-US");
    await new Promise(r => setTimeout(r, 500));
    await playTTS(spanishText, "es-ES");
    await new Promise(r => setTimeout(r, 500));

    recorder.stop();
  };

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => speaking ? stop() : speakBilingual(sentence)}
        className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors"
      >
        {speaking ? "⏹ Detener" : "🔊 Escuchar"}
      </button>

      <button
        onClick={downloadAudio}
        disabled={recording}
        className="flex items-center gap-2 px-4 py-2 bg-bg-secondary text-text border border-border rounded-xl text-sm font-medium hover:bg-border transition-colors disabled:opacity-50"
      >
        {recording ? "⏳ Grabando..." : "📥 MP3"}
      </button>

      <button
        onClick={() => generateVideo(sentence)}
        disabled={exporting}
        className="flex items-center gap-2 px-4 py-2 bg-bg-secondary text-text border border-border rounded-xl text-sm font-medium hover:bg-border transition-colors disabled:opacity-50"
      >
        {exporting ? `🎬 ${Math.round(progress)}%` : "🎬 MP4"}
      </button>
    </div>
  );
}
