import { useState } from 'react';
import { useSpeech } from '../hooks/useSpeech';
import { useVideoExport } from '../hooks/useVideoExport';
import { translations, sentenceTranslations } from '../data/languageData';
import { webmBlobToMp3 } from '../utils/mp3Encoder';
import { speakTTS, stopTTS } from '../utils/speakTTS';

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

export default function AudioControls({ sentence }) {
  const { speakBilingual, speaking, stop } = useSpeech();
  const { generateVideo, exporting, progress } = useVideoExport();
  const [recording, setRecording] = useState(false);
  const [recordingVideo, setRecordingVideo] = useState(false);

  const downloadAudio = async () => {
    setRecording(true);
    const audioStream = await captureTabAudio();
    if (!audioStream) {
      alert("Para descargar audio, necesitas usar Chrome y aceptar compartir la pestaña cuando te lo pida.");
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
      audioStream.getTracks().forEach(t => t.stop());
      setRecording(false);
    };

    recorder.start();
    const spanishText = sentenceTranslations[sentence] ||
      sentence.split(" ").map(w => translations[w] || w).join(" ");

    await speakTTS(sentence, "en-US", 0.85);
    await new Promise(r => setTimeout(r, 600));
    await speakTTS(spanishText, "es-ES", 0.85);
    await new Promise(r => setTimeout(r, 600));
    recorder.stop();
  };

  const handleVideoExport = async () => {
    setRecordingVideo(true);
    await generateVideo(sentence);
    setRecordingVideo(false);
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
          <>
            <span className="animate-pulse">⏺</span> Grabando...
          </>
        ) : "📥 MP3"}
      </button>

      <button
        onClick={handleVideoExport}
        disabled={exporting || recordingVideo}
        className="flex items-center gap-2 px-4 py-2.5 bg-violet-500 text-white rounded-xl text-sm font-medium hover:bg-violet-600 active:scale-[0.97] transition-all shadow-sm disabled:opacity-50"
      >
        {exporting ? (
          <>
            <span className="animate-pulse">⏺</span> {Math.round(progress)}%
          </>
        ) : "🎬 MP4"}
      </button>
    </div>
  );
}
