import { useState } from 'react';
import { useSpeech } from '../hooks/useSpeech';
import { useVideoExport } from '../hooks/useVideoExport';
import { getGoogleTTSUrl } from '../utils/googleTTS';
import { getSpanishText } from '../services/translationService';
import { audioBufferToMp3, mergeAudioBuffers } from '../utils/mp3Encoder';

async function fetchTTSBuffer(ctx, text, lang) {
  const resp = await fetch(getGoogleTTSUrl(text, lang));
  if (!resp.ok) throw new Error(`TTS ${lang} failed: ${resp.status}`);
  const arr = await resp.arrayBuffer();
  return ctx.decodeAudioData(arr);
}

export default function AudioControls({ sentence }) {
  const { speakBilingual, speaking, stop } = useSpeech();
  const { generateVideo, exporting, progress } = useVideoExport();
  const [recording, setRecording] = useState(false);

  const downloadAudio = async () => {
    setRecording(true);
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const enBuf = await fetchTTSBuffer(audioCtx, sentence, 'en');
      const buffers = [enBuf];

      const spanishText = await getSpanishText(sentence);
      if (spanishText) {
        const esBuf = await fetchTTSBuffer(audioCtx, spanishText, 'es').catch(() => null);
        if (esBuf) buffers.push(esBuf);
      }

      const merged = mergeAudioBuffers(audioCtx, buffers, 0.5);
      const mp3Blob = audioBufferToMp3(merged);
      audioCtx.close();

      const url = URL.createObjectURL(mp3Blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `english-${sentence.replace(/\s+/g, '-').toLowerCase().slice(0, 40)}.mp3`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("MP3 download failed:", err);
      alert("Error al descargar el MP3. Verifica tu conexion e intenta de nuevo.");
    }
    setRecording(false);
  };

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => speaking ? stop() : speakBilingual(sentence)}
        className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary/90 active:scale-[0.97] transition-all shadow-sm"
      >
        {speaking ? "⏹ Detener" : "🔊 Escuchar"}
      </button>

      <button
        onClick={downloadAudio}
        disabled={recording}
        className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500 text-white rounded-xl text-sm font-medium hover:bg-emerald-600 active:scale-[0.97] transition-all shadow-sm disabled:opacity-50"
      >
        {recording ? (
          <><span className="animate-pulse">⏺</span> Descargando...</>
        ) : "📥 MP3"}
      </button>

      <button
        onClick={() => generateVideo(sentence)}
        disabled={exporting}
        className="flex items-center gap-2 px-4 py-2.5 bg-violet-500 text-white rounded-xl text-sm font-medium hover:bg-violet-600 active:scale-[0.97] transition-all shadow-sm disabled:opacity-50"
      >
        {exporting ? (
          <><span className="animate-pulse">⏺</span> {Math.round(progress)}%</>
        ) : "🎬 MP4"}
      </button>
    </div>
  );
}
