import { useState, useCallback } from 'react';
import { translations, sentenceTranslations } from '../data/languageData';
import { getGoogleTTSUrl } from '../utils/googleTTS';

function rrect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r); ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h); ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r); ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y); ctx.closePath();
}

function drawBg(ctx, w, h) {
  const g = ctx.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, '#0F172A'); g.addColorStop(0.5, '#1E293B'); g.addColorStop(1, '#0F172A');
  ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
  ctx.globalAlpha = 0.04; ctx.fillStyle = '#3B82F6';
  ctx.beginPath(); ctx.arc(w * 0.8, h * 0.2, 200, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(w * 0.2, h * 0.8, 150, 0, Math.PI * 2); ctx.fill();
  ctx.globalAlpha = 1;
}

function drawCard(ctx, word, x, y, w, h, color, active) {
  ctx.save();
  rrect(ctx, x, y, w, h, 14);
  ctx.fillStyle = active ? color : 'rgba(255,255,255,0.06)'; ctx.fill();
  if (active) { ctx.shadowColor = color; ctx.shadowBlur = 18; ctx.fill(); ctx.shadowBlur = 0; }
  ctx.strokeStyle = active ? color : 'rgba(255,255,255,0.08)'; ctx.lineWidth = 2; ctx.stroke();
  ctx.restore();
  ctx.font = 'bold ' + (active ? 36 : 32) + 'px Inter, system-ui, sans-serif';
  ctx.fillStyle = active ? '#FFF' : 'rgba(255,255,255,0.25)';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(word, x + w / 2, y + h / 2);
}

function drawProgress(ctx, w, h, ratio) {
  ctx.fillStyle = 'rgba(255,255,255,0.08)';
  rrect(ctx, 60, h - 36, w - 120, 6, 3); ctx.fill();
  if (ratio > 0) {
    ctx.fillStyle = '#3B82F6';
    rrect(ctx, 60, h - 36, (w - 120) * ratio, 6, 3); ctx.fill();
  }
}

function drawEnglish(canvas, words, count) {
  const ctx = canvas.getContext('2d'); const w = canvas.width; const h = canvas.height;
  drawBg(ctx, w, h);
  ctx.font = '600 20px Inter, system-ui, sans-serif'; ctx.fillStyle = '#64748B'; ctx.textAlign = 'center';
  ctx.fillText('EnglishApp', w / 2, 50);
  ctx.font = '500 16px Inter, system-ui, sans-serif'; ctx.fillStyle = '#3B82F6';
  ctx.fillText('ENGLISH', w / 2, 85);
  const cw = 220, ch = 56, gap = 14;
  const sy = (h - words.length * (ch + gap)) / 2 + 20;
  words.forEach((word, i) => {
    drawCard(ctx, word, (w - cw) / 2, sy + i * (ch + gap), cw, ch, '#3B82F6', i < count);
  });
  drawProgress(ctx, w, h, count / words.length);
}

function drawSpanish(canvas, engWords, spaWords, count) {
  const ctx = canvas.getContext('2d'); const w = canvas.width; const h = canvas.height;
  drawBg(ctx, w, h);
  ctx.font = '600 20px Inter, system-ui, sans-serif'; ctx.fillStyle = '#64748B'; ctx.textAlign = 'center';
  ctx.fillText('EnglishApp', w / 2, 50);
  ctx.font = '500 16px Inter, system-ui, sans-serif'; ctx.fillStyle = '#22C55E';
  ctx.fillText('ESPAÑOL', w / 2, 85);
  const all = [...engWords, '---', ...spaWords];
  const cw = 240, ch = 46, gap = 10;
  const sy = (h - all.length * (ch + gap)) / 2 + 20;
  all.forEach((word, i) => {
    if (word === '---') {
      ctx.strokeStyle = 'rgba(255,255,255,0.1)'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(w / 2 - 60, sy + i * (ch + gap) + ch / 2);
      ctx.lineTo(w / 2 + 60, sy + i * (ch + gap) + ch / 2); ctx.stroke(); return;
    }
    const isEng = i < engWords.length;
    const active = isEng || (i > engWords.length && (i - engWords.length - 1) < count);
    drawCard(ctx, word, (w - cw) / 2, sy + i * (ch + gap), cw, ch, isEng ? '#64748B' : '#22C55E', active);
  });
}

function playGoogleAudio(text, lang) {
  return new Promise(resolve => {
    const url = getGoogleTTSUrl(text, lang);
    const audio = new Audio(url);
    audio.onended = resolve; audio.onerror = resolve;
    audio.play().catch(resolve);
    setTimeout(resolve, text.length * 120 + 5000);
  });
}

function pickMime() {
  const list = ['video/mp4;codecs=avc1', 'video/webm;codecs=vp9,opus', 'video/webm'];
  return list.find(m => MediaRecorder.isTypeSupported(m)) || 'video/webm';
}

export function useVideoExport() {
  const [exporting, setExporting] = useState(false);
  const [progress, setProgress] = useState(0);

  const generateVideo = useCallback(async (sentence, onDone) => {
    setExporting(true); setProgress(0);
    const canvas = document.createElement('canvas');
    canvas.width = 1080; canvas.height = 1080;

    const words = sentence.split(' ');
    const spanishText = sentenceTranslations[sentence] ||
      words.map(w => translations[w] || w).join(' ');
    const spaWords = spanishText.split(' ');

    const canvasStream = canvas.captureStream(30);
    let combinedStream = canvasStream;

    // Capture Google TTS audio
    try {
      const audioCtx = new AudioContext();
      const dest = audioCtx.createMediaStreamDestination();
      const enAudio = new Audio(getGoogleTTSUrl(sentence, 'en'));
      const esAudio = new Audio(getGoogleTTSUrl(spanishText, 'es'));
      const enSrc = audioCtx.createMediaElementSource(enAudio);
      enSrc.connect(dest);
      const esSrc = audioCtx.createMediaElementSource(esAudio);
      esSrc.connect(dest);
      combinedStream = new MediaStream([...canvasStream.getVideoTracks(), ...dest.stream.getAudioTracks()]);

      const mime = pickMime();
      const ext = mime.includes('mp4') ? 'mp4' : 'webm';
      const rec = new MediaRecorder(combinedStream, { mimeType: mime });
      const chunks = [];
      rec.ondataavailable = e => { if (e.data.size > 0) chunks.push(e.data); };
      rec.onstop = () => {
        const blob = new Blob(chunks, { type: mime.split(';')[0] });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = 'englishapp-' + Date.now() + '.' + ext; a.click();
        URL.revokeObjectURL(url);
        audioCtx.close();
        setExporting(false); setProgress(100); onDone?.();
      };

      rec.start(100);

      for (let i = 0; i < words.length; i++) {
        drawEnglish(canvas, words, i + 1);
        setProgress((i / (words.length + spaWords.length)) * 50);
        await new Promise(r => setTimeout(r, 400));
      }

      enAudio.play().catch(() => {});
      await new Promise(r => setTimeout(r, sentence.length * 120 + 2000));
      await new Promise(r => setTimeout(r, 500));

      for (let i = 0; i < spaWords.length; i++) {
        drawSpanish(canvas, words, spaWords, i + 1);
        setProgress(50 + (i / spaWords.length) * 40);
        await new Promise(r => setTimeout(r, 400));
      }

      esAudio.play().catch(() => {});
      await new Promise(r => setTimeout(r, spanishText.length * 120 + 2000));
      await new Promise(r => setTimeout(r, 500));

      setProgress(95);
      rec.stop();
    } catch (e) {
      console.warn('Audio capture failed, recording video only:', e);
      const mime = pickMime();
      const ext = mime.includes('mp4') ? 'mp4' : 'webm';
      const rec = new MediaRecorder(canvasStream, { mimeType: mime });
      const chunks = [];
      rec.ondataavailable = e2 => { if (e2.data.size > 0) chunks.push(e2.data); };
      rec.onstop = () => {
        const blob = new Blob(chunks, { type: mime.split(';')[0] });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = 'englishapp-' + Date.now() + '.' + ext; a.click();
        URL.revokeObjectURL(url);
        setExporting(false); setProgress(100); onDone?.();
      };
      rec.start(100);
      for (let i = 0; i < words.length; i++) {
        drawEnglish(canvas, words, i + 1); await new Promise(r => setTimeout(r, 400));
      }
      await playGoogleAudio(sentence, 'en');
      for (let i = 0; i < spaWords.length; i++) {
        drawSpanish(canvas, words, spaWords, i + 1); await new Promise(r => setTimeout(r, 400));
      }
      await playGoogleAudio(spanishText, 'es');
      await new Promise(r => setTimeout(r, 500));
      rec.stop();
    }
  }, []);

  return { generateVideo, exporting, progress };
}
