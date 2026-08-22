import { useState, useCallback } from 'react';
import { getGoogleTTSUrl } from '../utils/googleTTS';
import { translateSentence } from '../utils/translateSentence';

// ---------- Canvas drawing ----------

function rrect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r); ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h); ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r); ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y); ctx.closePath();
}

function drawBg(ctx, w, h) {
  const g = ctx.createLinearGradient(0, 0, w, h);
  g.addColorStop(0, '#0F172A'); g.addColorStop(0.5, '#1E293B'); g.addColorStop(1, '#0F172A');
  ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
  ctx.globalAlpha = 0.03;
  ctx.fillStyle = '#3B82F6';
  ctx.beginPath(); ctx.arc(w * 0.85, h * 0.15, 250, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#22C55E';
  ctx.beginPath(); ctx.arc(w * 0.15, h * 0.85, 200, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#8B5CF6';
  ctx.beginPath(); ctx.arc(w * 0.5, h * 0.5, 300, 0, Math.PI * 2); ctx.fill();
  ctx.globalAlpha = 1;
}

function drawCard(ctx, word, x, y, w, h, color, active) {
  ctx.save();
  rrect(ctx, x, y, w, h, 12);
  if (active) {
    ctx.shadowColor = color; ctx.shadowBlur = 24;
    ctx.fillStyle = color; ctx.fill();
    ctx.shadowBlur = 0;
  } else {
    ctx.fillStyle = 'rgba(255,255,255,0.05)'; ctx.fill();
  }
  ctx.strokeStyle = active ? color : 'rgba(255,255,255,0.08)';
  ctx.lineWidth = 2; ctx.stroke();
  ctx.restore();
  ctx.font = 'bold ' + (active ? 34 : 30) + 'px Inter, system-ui, sans-serif';
  ctx.fillStyle = active ? '#FFF' : 'rgba(255,255,255,0.2)';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(word, x + w / 2, y + h / 2);
}

function drawProgress(ctx, w, h, ratio) {
  ctx.fillStyle = 'rgba(255,255,255,0.06)';
  rrect(ctx, 80, h - 44, w - 160, 8, 4); ctx.fill();
  if (ratio > 0) {
    const g = ctx.createLinearGradient(80, 0, 80 + (w - 160) * ratio, 0);
    g.addColorStop(0, '#3B82F6'); g.addColorStop(1, '#8B5CF6');
    ctx.fillStyle = g;
    rrect(ctx, 80, h - 44, (w - 160) * ratio, 8, 4); ctx.fill();
  }
}

function drawLabelPill(ctx, w, text, color, bg) {
  const labelW = 120, labelH = 32;
  rrect(ctx, (w - labelW) / 2, 75, labelW, labelH, 16);
  ctx.fillStyle = bg; ctx.fill();
  ctx.strokeStyle = color; ctx.globalAlpha = 0.35; ctx.lineWidth = 1; ctx.stroke(); ctx.globalAlpha = 1;
  ctx.font = '600 14px Inter, system-ui, sans-serif'; ctx.fillStyle = color;
  ctx.fillText(text, w / 2, 96);
}

function drawEnglish(canvas, words, count) {
  const ctx = canvas.getContext('2d'); const w = canvas.width; const h = canvas.height;
  drawBg(ctx, w, h);
  ctx.font = '600 22px Inter, system-ui, sans-serif'; ctx.fillStyle = '#475569'; ctx.textAlign = 'center';
  ctx.fillText('EnglishApp', w / 2, 55);
  drawLabelPill(ctx, w, 'ENGLISH', '#3B82F6', 'rgba(59,130,246,0.15)');
  const cw = 240, ch = 60, gap = 16;
  const sy = (h - words.length * (ch + gap)) / 2 + 30;
  words.forEach((word, i) => {
    drawCard(ctx, word, (w - cw) / 2, sy + i * (ch + gap), cw, ch, '#3B82F6', i < count);
  });
  drawProgress(ctx, w, h, count / words.length);
}

function drawSpanish(canvas, engWords, spaWords, count) {
  const ctx = canvas.getContext('2d'); const w = canvas.width; const h = canvas.height;
  drawBg(ctx, w, h);
  ctx.font = '600 22px Inter, system-ui, sans-serif'; ctx.fillStyle = '#475569'; ctx.textAlign = 'center';
  ctx.fillText('EnglishApp', w / 2, 55);
  drawLabelPill(ctx, w, 'ESPA\u00d1OL', '#22C55E', 'rgba(34,197,94,0.15)');
  const all = [...engWords, '---', ...spaWords];
  const cw = 260, ch = 44, gap = 10;
  const sy = (h - all.length * (ch + gap)) / 2 + 20;
  all.forEach((word, i) => {
    if (word === '---') {
      ctx.strokeStyle = 'rgba(255,255,255,0.08)'; ctx.lineWidth = 1; ctx.setLineDash([6, 4]);
      ctx.beginPath(); ctx.moveTo(w / 2 - 70, sy + i * (ch + gap) + ch / 2);
      ctx.lineTo(w / 2 + 70, sy + i * (ch + gap) + ch / 2); ctx.stroke();
      ctx.setLineDash([]); return;
    }
    const isEng = i < engWords.length;
    const active = isEng || (i > engWords.length && (i - engWords.length - 1) < count);
    drawCard(ctx, word, (w - cw) / 2, sy + i * (ch + gap), cw, ch, isEng ? '#64748B' : '#22C55E', active);
  });
}

// ---------- Audio helpers ----------

async function fetchTTSBuffer(ctx, text, lang) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10000);
  try {
    const resp = await fetch(getGoogleTTSUrl(text, lang), { signal: controller.signal });
    if (!resp.ok) throw new Error(`TTS ${lang}: ${resp.status}`);
    const arr = await resp.arrayBuffer();
    return await ctx.decodeAudioData(arr);
  } finally {
    clearTimeout(timer);
  }
}

// Play an AudioBuffer into dest (recording) and speakers; resolves on end or maxMs cap
async function playBuffer(ctx, audioBuffer, dest, maxMs) {
  if (ctx.state === 'suspended') {
    try { await ctx.resume(); } catch { /* ignore */ }
  }
  return new Promise(resolve => {
    const source = ctx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(dest);
    source.connect(ctx.destination); // user hears it while recording
    let done = false;
    const finish = () => { if (!done) { done = true; resolve(); } };
    source.onended = finish;
    try { source.start(); } catch { finish(); }
    setTimeout(finish, maxMs || ((audioBuffer.duration + 1) * 1000));
  });
}

function pickMime() {
  const list = ['video/mp4', 'video/mp4;codecs=avc1', 'video/webm;codecs=vp9,opus', 'video/webm'];
  return list.find(m => MediaRecorder.isTypeSupported(m)) || 'video/webm';
}

const WORD_STEP_MS = 450;

// ---------- Hook ----------

export function useVideoExport() {
  const [exporting, setExporting] = useState(false);
  const [progress, setProgress] = useState(0);

  const generateVideo = useCallback(async (sentence, onDone) => {
    setExporting(true); setProgress(0);

    // ONE AudioContext for everything: decode + playback. Must be resumed or output is silent.
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') {
      try { await audioCtx.resume(); } catch { /* ignore */ }
    }

    // Pre-fetch audio BEFORE recording starts (cannot hang: abort after 10s)
    let enBuf = null, esBuf = null;
    try {
      [enBuf, esBuf] = await Promise.all([
        fetchTTSBuffer(audioCtx, sentence, 'en').catch(() => null),
        fetchTTSBuffer(audioCtx, translateSentence(sentence), 'es').catch(() => null)
      ]);
    } catch { /* continue without audio */ }

    if (!enBuf && !esBuf) {
      alert('No se pudo generar el audio para el video. Verifica tu conexion.');
      audioCtx.close().catch(() => {});
      setExporting(false);
      onDone?.();
      return;
    }

    const canvas = document.createElement('canvas');
    canvas.width = 1080; canvas.height = 1080;

    const words = sentence.split(' ');
    const spanishText = translateSentence(sentence);
    const spaWords = spanishText.split(' ');

    const dest = audioCtx.createMediaStreamDestination();
    const canvasStream = canvas.captureStream(30);
    const combinedStream = new MediaStream([
      ...canvasStream.getVideoTracks(),
      ...dest.stream.getAudioTracks()
    ]);

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
      audioCtx.close().catch(() => {});
      setExporting(false); setProgress(100); onDone?.();
    };

    rec.start(200);

    // Phase 1: reveal English words
    for (let i = 0; i < words.length; i++) {
      drawEnglish(canvas, words, i + 1);
      setProgress((i / (words.length + spaWords.length)) * 40);
      await new Promise(r => setTimeout(r, WORD_STEP_MS));
    }
    // Pause before narration
    drawEnglish(canvas, words, words.length);
    await new Promise(r => setTimeout(r, 300));

    // Phase 2: English narration (recorded)
    if (enBuf) {
      await playBuffer(audioCtx, enBuf, dest, sentence.length * 150 + 6000);
    }
    setProgress(50);

    // Phase 3: reveal Spanish words
    for (let i = 0; i < spaWords.length; i++) {
      drawSpanish(canvas, words, spaWords, i + 1);
      setProgress(50 + (i / spaWords.length) * 40);
      await new Promise(r => setTimeout(r, WORD_STEP_MS));
    }
    drawSpanish(canvas, words, spaWords, spaWords.length);
    await new Promise(r => setTimeout(r, 300));

    // Phase 4: Spanish narration (recorded)
    if (esBuf) {
      await playBuffer(audioCtx, esBuf, dest, spanishText.length * 150 + 6000);
    }

    // Tail so the last word does not cut off
    await new Promise(r => setTimeout(r, 800));
    setProgress(95);

    if (rec.state !== 'inactive') rec.stop();
  }, []);

  return { generateVideo, exporting, progress };
}
