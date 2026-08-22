import { useState, useCallback } from 'react';
import { translations, sentenceTranslations } from '../data/languageData';

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

function drawFrame(canvas, words, currentIndex, color = "#1E293B") {
  const ctx = canvas.getContext("2d");
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, "#F8FAFC");
  gradient.addColorStop(1, "#E2E8F0");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.font = 'bold 24px Inter, sans-serif';
  ctx.fillStyle = "#94A3B8";
  ctx.textAlign = "center";
  ctx.fillText("EnglishApp", canvas.width / 2, 60);
  ctx.font = 'bold 48px Inter, sans-serif';
  ctx.textBaseline = "middle";
  const lineHeight = 70;
  const totalLines = words.length + 1;
  const startY = canvas.height / 2 - ((totalLines - 1) * lineHeight) / 2;
  words.forEach((word, i) => {
    if (i <= currentIndex) {
      ctx.fillStyle = i === currentIndex ? "#3B82F6" : color;
      ctx.fillText(word, canvas.width / 2, startY + i * lineHeight);
    }
  });
  if (currentIndex >= words.length) {
    ctx.strokeStyle = "#E2E8F0";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2 - 100, startY + words.length * lineHeight);
    ctx.lineTo(canvas.width / 2 + 100, startY + words.length * lineHeight);
    ctx.stroke();
  }
}

function drawSpanishFrame(canvas, allWords, currentIndex, totalEnglishWords) {
  const ctx = canvas.getContext("2d");
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, "#F8FAFC");
  gradient.addColorStop(1, "#E2E8F0");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.font = 'bold 24px Inter, sans-serif';
  ctx.fillStyle = "#94A3B8";
  ctx.textAlign = "center";
  ctx.fillText("EnglishApp", canvas.width / 2, 60);
  ctx.font = 'bold 36px Inter, sans-serif';
  ctx.textBaseline = "middle";
  const lineHeight = 60;
  const totalLines = allWords.length;
  const startY = canvas.height / 2 - ((totalLines - 1) * lineHeight) / 2;
  allWords.forEach((word, i) => {
    if (i < totalEnglishWords) {
      ctx.fillStyle = "#CBD5E1";
      ctx.fillText(word, canvas.width / 2, startY + i * lineHeight);
    } else if (i === totalEnglishWords) {
      ctx.strokeStyle = "#E2E8F0";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2 - 100, startY + i * lineHeight);
      ctx.lineTo(canvas.width / 2 + 100, startY + i * lineHeight);
      ctx.stroke();
    } else {
      if (i <= currentIndex) {
        ctx.fillStyle = i === currentIndex ? "#22C55E" : "#64748B";
        ctx.fillText(word, canvas.width / 2, startY + i * lineHeight);
      }
    }
  });
}

function pickMime(preferred) {
  if (preferred && MediaRecorder.isTypeSupported(preferred)) return preferred;
  const fallbacks = [
    'video/mp4;codecs=avc1',
    'video/webm;codecs=vp9,opus',
    'video/webm;codecs=vp8,opus',
    'video/webm'
  ];
  for (const m of fallbacks) {
    if (MediaRecorder.isTypeSupported(m)) return m;
  }
  return 'video/webm';
}

export function useVideoExport() {
  const [exporting, setExporting] = useState(false);
  const [progress, setProgress] = useState(0);

  const generateVideo = useCallback(async (sentence, onDone) => {
    setExporting(true);
    setProgress(0);

    const canvas = document.createElement("canvas");
    canvas.width = 1080;
    canvas.height = 1080;

    const words = sentence.split(" ");
    const spanishText = sentenceTranslations[sentence] ||
      words.map(w => translations[w] || w).join(" ");
    const spanishWords = spanishText.split(" ");
    const allWords = [...words, "", ...spanishWords];

    const audioStream = await captureTabAudio();
    const canvasStream = canvas.captureStream(30);

    const combinedStream = audioStream
      ? new MediaStream([...canvasStream.getVideoTracks(), ...audioStream.getAudioTracks()])
      : canvasStream;

    const mimeType = pickMime('video/mp4;codecs=avc1');
    const ext = mimeType.includes('mp4') ? 'mp4' : 'webm';
    const mediaRecorder = new MediaRecorder(combinedStream, { mimeType });
    const chunks = [];

    mediaRecorder.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data); };
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: mimeType.split(';')[0] });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `englishapp-${Date.now()}.${ext}`;
      a.click();
      URL.revokeObjectURL(url);
      audioStream?.getTracks().forEach(t => t.stop());
      setExporting(false);
      setProgress(100);
      onDone?.();
    };

    mediaRecorder.start(100);

    for (let i = 0; i < words.length; i++) {
      drawFrame(canvas, words, i);
      setProgress((i / allWords.length) * 50);
      await new Promise(r => setTimeout(r, 400));
    }

    await playTTS(sentence, "en-US");
    await new Promise(r => setTimeout(r, 500));

    for (let i = 0; i < spanishWords.length; i++) {
      drawSpanishFrame(canvas, allWords, words.length + 1 + i, words.length);
      setProgress(50 + (i / spanishWords.length) * 40);
      await new Promise(r => setTimeout(r, 400));
    }

    await playTTS(spanishText, "es-ES");
    await new Promise(r => setTimeout(r, 500));

    setProgress(95);
    mediaRecorder.stop();
  }, []);

  return { generateVideo, exporting, progress };
}
