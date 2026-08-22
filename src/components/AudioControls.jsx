import { useState } from 'react';
import { useSpeech } from '../hooks/useSpeech';
import { useVideoExport } from '../hooks/useVideoExport';
import { translations, sentenceTranslations } from '../data/languageData';
import { webmBlobToMp3 } from '../utils/mp3Encoder';
import { speakGoogleTTS, getGoogleTTSUrl } from '../utils/googleTTS';

function playLocalTTS(text, lang) {
  return new Promise(resolve => {
    if (!window.speechSynthesis) { resolve(); return; }
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = lang;
    utt.rate = 0.9;
    utt.onend = resolve;
    utt.onerror = resolve;
    setTimeout(resolve, text.length * 120 + 3000);
    window.speechSynthesis.speak(utt);
  });
}

export default function AudioControls({ sentence }) {
  const { speakBilingual, speaking, stop } = useSpeech();
  const { generateVideo, exporting, progress } = useVideoExport();
  const [recording, setRecording] = useState(false);

  const downloadAudio = async () => {
    setRecording(true);
    try {
      const spanishText = sentenceTranslations[sentence] ||
        sentence.split(" ").map(w => translations[w] || w).join(" ");

      // Fetch English TTS from Google
      const enUrl = getGoogleTTSUrl(sentence, 'en');
      const esUrl = getGoogleTTSUrl(spanishText, 'es');

      const enResp = await fetch(enUrl);
      const esResp = await fetch(esUrl);

      if (!enResp.ok || !esResp.ok) throw new Error('TTS fetch failed');

      const enBlob = await enResp.blob();
      const esBlob = await esResp.blob();

      // Decode both to audio buffers
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const enArrBuf = await enBlob.arrayBuffer();
      const esArrBuf = await esBlob.arrayBuffer();
      const enBuf = await audioCtx.decodeAudioData(enArrBuf);
      const esBuf = await audioCtx.decodeAudioData(esArrBuf);

      // Concatenate audio buffers
      const totalLen = enBuf.length + esBuf.length;
      const mergedBuf = audioCtx.createBuffer(
        1, totalLen, enBuf.sampleRate
      );
      const mergedData = mergedBuf.getChannelData(0);
      mergedData.set(enBuf.getChannelData(0), 0);
      mergedData.set(esBuf.getChannelData(0), enBuf.length);

      // Convert to WAV then to MP3
      const wavBlob = audioBufferToWav(mergedBuf);
      const mp3Blob = await webmBlobToMp3(wavBlob);

      const url = URL.createObjectURL(mp3Blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `english-${sentence.replace(/\s+/g, '-').toLowerCase()}.mp3`;
      a.click();
      URL.revokeObjectURL(url);
      audioCtx.close();
    } catch (err) {
      console.error("MP3 download failed:", err);
      alert("Error al descargar. Verifica tu conexion a internet.");
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

// Helper: Convert AudioBuffer to WAV Blob
function audioBufferToWav(buffer) {
  const numChannels = 1;
  const sampleRate = buffer.sampleRate;
  const format = 1; // PCM
  const bitDepth = 16;
  const bytesPerSample = bitDepth / 8;
  const blockAlign = numChannels * bytesPerSample;
  const data = buffer.getChannelData(0);
  const dataLength = data.length * bytesPerSample;
  const headerLength = 44;
  const totalLength = headerLength + dataLength;

  const arrayBuffer = new ArrayBuffer(totalLength);
  const view = new DataView(arrayBuffer);

  function writeString(offset, str) {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  }

  writeString(0, 'RIFF');
  view.setUint32(4, totalLength - 8, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, format, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * blockAlign, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitDepth, true);
  writeString(36, 'data');
  view.setUint32(40, dataLength, true);

  let offset = 44;
  for (let i = 0; i < data.length; i++) {
    const sample = Math.max(-1, Math.min(1, data[i]));
    view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
    offset += 2;
  }

  return new Blob([arrayBuffer], { type: 'audio/wav' });
}
