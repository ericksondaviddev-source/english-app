import { useState } from 'react';
import { useSpeech } from '../hooks/useSpeech';
import { useVideoExport } from '../hooks/useVideoExport';
import { translations, sentenceTranslations } from '../data/languageData';
import { getGoogleTTSUrl, speakGoogleTTS } from '../utils/googleTTS';
import { webmBlobToMp3 } from '../utils/mp3Encoder';

export default function AudioControls({ sentence }) {
  const { speakBilingual, speaking, stop } = useSpeech();
  const { generateVideo, exporting, progress } = useVideoExport();
  const [recording, setRecording] = useState(false);

  const downloadAudio = async () => {
    setRecording(true);
    try {
      const spanishText = sentenceTranslations[sentence] ||
        sentence.split(" ").map(w => translations[w] || w).join(" ");

      // Play English then Spanish using <audio> elements
      const enAudio = new Audio(getGoogleTTSUrl(sentence, 'en'));
      const esAudio = new Audio(getGoogleTTSUrl(spanishText, 'es'));

      // Use AudioContext to route both through a single destination
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const dest = audioCtx.createMediaStreamDestination();

      const enSrc = audioCtx.createMediaElementSource(enAudio);
      enSrc.connect(dest);
      const esSrc = audioCtx.createMediaElementSource(esAudio);
      esSrc.connect(dest);

      // Record the combined stream
      const recorder = new MediaRecorder(dest.stream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
          ? 'audio/webm;codecs=opus' : 'audio/webm'
      });
      const chunks = [];
      recorder.ondataavailable = e => { if (e.data.size > 0) chunks.push(e.data); };

      recorder.onstop = async () => {
        try {
          const webmBlob = new Blob(chunks, { type: 'audio/webm' });
          const mp3Blob = await webmBlobToMp3(webmBlob);
          const url = URL.createObjectURL(mp3Blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `english-${sentence.replace(/\s+/g, '-').toLowerCase()}.mp3`;
          a.click();
          URL.revokeObjectURL(url);
        } catch (err) {
          console.error("MP3 encoding failed:", err);
          const blob = new Blob(chunks, { type: 'audio/webm' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `english-${sentence.replace(/\s+/g, '-').toLowerCase()}.webm`;
          a.click();
          URL.revokeObjectURL(url);
        }
        audioCtx.close();
        setRecording(false);
      };

      recorder.start();

      // Play English
      enAudio.play().catch(() => {});
      await new Promise(r => {
        enAudio.onended = r;
        enAudio.onerror = r;
        setTimeout(r, sentence.length * 120 + 3000);
      });

      // Small pause
      await new Promise(r => setTimeout(r, 500));

      // Play Spanish
      esAudio.play().catch(() => {});
      await new Promise(r => {
        esAudio.onended = r;
        esAudio.onerror = r;
        setTimeout(r, spanishText.length * 120 + 3000);
      });

      // Wait a bit more then stop
      await new Promise(r => setTimeout(r, 500));
      recorder.stop();
    } catch (err) {
      console.error("Audio download failed:", err);
      alert("Error al descargar audio. Verifica tu conexion.");
      setRecording(false);
    }
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
