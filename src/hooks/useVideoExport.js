import { useState, useCallback } from 'react';
import { Output, Mp4OutputFormat, BufferTarget, CanvasSource, AudioBufferSource,
         QUALITY_HIGH, getFirstEncodableVideoCodec, getFirstEncodableAudioCodec } from 'mediabunny';
import { translateSentence } from '../utils/translateSentence';
import { getGoogleTTSUrl } from '../utils/googleTTS';

// ---------- Easing ----------
const easeOutBack = t => { const c = 1.70158; const x = t - 1; return 1 + (c + 1) * x * x * x + c * x * x; };
const easeOutCubic = t => 1 - Math.pow(1 - t, 3);
const clamp01 = t => Math.max(0, Math.min(1, t));

const W = 1080, H = 1080, FPS = 30;
const WORD_STEP = 0.45, PAUSE = 0.35, INTRO_DUR = 1.0, OUTRO_DUR = 1.2;

// ---------- Drawing helpers ----------

function rrect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r); ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h); ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r); ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y); ctx.closePath();
}

function drawBg(ctx, t) {
  const g = ctx.createLinearGradient(0, 0, W, H);
  g.addColorStop(0, '#0B1120'); g.addColorStop(0.5, '#16233B'); g.addColorStop(1, '#0B1120');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  // Floating decorative orbs
  const orbs = [
    { x: 0.85, y: 0.14, r: 190, c: '59,130,246', sp: 0.7 },
    { x: 0.12, y: 0.82, r: 150, c: '34,197,94', sp: 0.5 },
    { x: 0.55, y: 0.5, r: 260, c: '139,92,246', sp: 0.35 },
  ];
  orbs.forEach((o, i) => {
    const ox = (o.x + Math.sin(t * o.sp + i * 2) * 0.02) * W;
    const oy = (o.y + Math.cos(t * o.sp * 1.3 + i) * 0.02) * H;
    ctx.globalAlpha = 0.05;
    ctx.fillStyle = 'rgb(' + o.c + ')';
    ctx.beginPath(); ctx.arc(ox, oy, o.r, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 1;
  });
}

function drawBrand(ctx, alpha = 1) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.font = '600 26px Inter, system-ui, sans-serif';
  ctx.fillStyle = '#64748B'; ctx.textAlign = 'center';
  ctx.fillText('\uD83C\uDDFA\uD83C\uDDF8 EnglishApp', W / 2, 64);
  ctx.restore();
}

function drawPill(ctx, text, color, bg, y, scale) {
  ctx.save();
  ctx.translate(W / 2, y);
  ctx.scale(scale, scale);
  ctx.font = '600 22px Inter, system-ui, sans-serif';
  const tw = ctx.measureText(text).width;
  const pw = tw + 56, ph = 44;
  rrect(ctx, -pw / 2, -ph / 2, pw, ph, ph / 2);
  ctx.fillStyle = bg; ctx.fill();
  ctx.strokeStyle = color; ctx.lineWidth = 1.5; ctx.stroke();
  ctx.fillStyle = color; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(text, 0, 1);
  ctx.restore();
}

function drawWordCard(ctx, word, cx, cy, color, progress) {
  if (progress <= 0) return;
  const p = easeOutBack(clamp01(progress));
  const cw = 250 * (0.85 + 0.15 * p);
  const ch = 62 * p;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(p, p);
  rrect(ctx, -cw / 2, -ch / 2, cw, ch, 16);
  const glow = ctx.createLinearGradient(-cw / 2, 0, cw / 2, 0);
  glow.addColorStop(0, color); glow.addColorStop(1, shade(color, -20));
  ctx.shadowColor = color; ctx.shadowBlur = 28 * p;
  ctx.fillStyle = glow; ctx.fill();
  ctx.shadowBlur = 0;
  ctx.strokeStyle = 'rgba(255,255,255,0.25)'; ctx.lineWidth = 1.5; ctx.stroke();
  ctx.font = '700 34px Inter, system-ui, sans-serif';
  ctx.fillStyle = '#FFF'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(word, 0, 2);
  ctx.restore();
}

function shade(hex, percent) {
  const num = parseInt(hex.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const r = Math.max(0, Math.min(255, (num >> 16) + amt));
  const g = Math.max(0, Math.min(255, ((num >> 8) & 0xFF) + amt));
  const b = Math.max(0, Math.min(255, (num & 0xFF) + amt));
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function drawProgressBar(ctx, ratio) {
  const bw = W - 200, bh = 10, bx = 100, by = H - 70;
  ctx.save();
  rrect(ctx, bx, by, bw, bh, bh / 2);
  ctx.fillStyle = 'rgba(255,255,255,0.07)'; ctx.fill();
  if (ratio > 0) {
    const g = ctx.createLinearGradient(bx, 0, bx + bw, 0);
    g.addColorStop(0, '#3B82F6'); g.addColorStop(0.5, '#8B5CF6'); g.addColorStop(1, '#22C55E');
    rrect(ctx, bx, by, Math.max(bh, bw * clamp01(ratio)), bh, bh / 2);
    ctx.fillStyle = g; ctx.fill();
  }
  ctx.restore();
}

function dimCards(ctx, words, color, alpha) {
  ctx.save(); ctx.globalAlpha = alpha;
  words.forEach((w, i) => {
    drawWordCard(ctx, w, W / 2, 220 + i * 78, color, 1);
  });
  ctx.restore();
}

// ---------- Timeline ----------
function buildTimeline(engWords, spaWords, engDur, spaDur) {
  let t = INTRO_DUR;
  const engRevealStart = t;
  t += engWords.length * WORD_STEP + PAUSE;
  const engAudioStart = t;
  t += Math.max(engDur, 1.2);
  t += PAUSE;
  const spaRevealStart = t;
  t += spaWords.length * WORD_STEP + PAUSE;
  const spaAudioStart = t;
  t += Math.max(spaDur, 1.2);
  const outroStart = t;
  t += OUTRO_DUR;
  return { engRevealStart, engAudioStart, spaRevealStart, spaAudioStart, outroStart, total: t };
}

// ---------- Scene renderer (deterministic per time t) ----------
function drawScene(ctx, tl, opts) {
  const { engWords, spaWords, color } = opts;
  drawBg(ctx, opts.t);
  drawBrand(ctx);

  // Intro
  if (opts.t < INTRO_DUR - 0.05) {
    const p = easeOutBack(clamp01(opts.t / 0.55));
    ctx.save();
    ctx.translate(W / 2, H / 2);
    ctx.scale(p, p);
    ctx.globalAlpha = clamp01(opts.t / 0.3);
    ctx.font = '800 72px Inter, system-ui, sans-serif';
    ctx.fillStyle = '#FFF'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('EnglishApp', 0, -40);
    ctx.font = '500 30px Inter, system-ui, sans-serif';
    ctx.fillStyle = '#94A3B8';
    ctx.fillText('Aprende ingl\u00e9s \uD83D\uDD0A', 0, 40);
    ctx.restore();
    drawProgressBar(ctx, opts.t / tl.total);
    return;
  }

  // Outro
  if (opts.t >= tl.outroStart) {
    const p = easeOutCubic(clamp01((opts.t - tl.outroStart) / 0.6));
    ctx.save();
    ctx.globalAlpha = p;
    ctx.font = '700 56px Inter, system-ui, sans-serif';
    ctx.fillStyle = '#FFF'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('\u2728 \u00A1Tu frase del d\u00EDa!', W / 2, H / 2 - 50);
    ctx.font = '500 28px Inter, system-ui, sans-serif';
    ctx.fillStyle = '#94A3B8';
    ctx.fillText('Comparte y sigue aprendiendo', W / 2, H / 2 + 30);
    ctx.restore();
    drawProgressBar(ctx, 1);
    return;
  }

  const inEng = opts.t < tl.spaRevealStart - PAUSE;
  // Language pill
  if (inEng) {
    drawPill(ctx, '\uD83C\uDDEC\uD83C\uDDEF ENGLISH', '#3B82F6', 'rgba(59,130,246,0.15)', 130, easeOutBack(clamp01((opts.t - INTRO_DUR) / 0.4)));
  } else {
    drawPill(ctx, '\uD83C\uDDEA\uD83C\uDDF8 ESPA\u00d1OL', '#22C55E', 'rgba(34,197,94,0.15)', 130, easeOutBack(clamp01((opts.t - tl.spaRevealStart + PAUSE) / 0.4)));
  }

  if (inEng) {
    engWords.forEach((w, i) => {
      const start = tl.engRevealStart + i * WORD_STEP;
      drawWordCard(ctx, w, W / 2, 250 + i * 78, color.eng, (opts.t - start) / 0.35);
    });
  } else {
    spaWords.forEach((w, i) => {
      const start = tl.spaRevealStart + i * WORD_STEP;
      drawWordCard(ctx, w, W / 2, 250 + i * 78, color.spa, (opts.t - start) / 0.35);
    });
  }

  // Narrating indicator: gentle pulse ring
  const narrating =
    (opts.t >= tl.engAudioStart && opts.t < tl.engAudioStart + Math.max(opts.engDur, 0)) ||
    (opts.t >= tl.spaAudioStart && opts.t < tl.outroStart);
  if (narrating) {
    const pulse = 0.5 + 0.5 * Math.sin(opts.t * 5);
    ctx.save();
    ctx.globalAlpha = 0.25 + 0.25 * pulse;
    ctx.strokeStyle = inEng ? '#3B82F6' : '#22C55E';
    ctx.lineWidth = 4;
    ctx.beginPath(); ctx.arc(W / 2, H - 150, 26 + pulse * 8, 0, Math.PI * 2); ctx.stroke();
    ctx.restore();
  }

  drawProgressBar(ctx, opts.t / tl.total);
}

// ---------- Audio helpers ----------

async function fetchTTSBuffer(ctx, text, lang) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10000);
  try {
    const resp = await fetch(getGoogleTTSUrl(text, lang), { signal: controller.signal });
    if (!resp.ok) throw new Error('TTS ' + lang + ': ' + resp.status);
    const arr = await resp.arrayBuffer();
    return await ctx.decodeAudioData(arr);
  } finally {
    clearTimeout(timer);
  }
}

// One big mono buffer spanning the whole video timeline (silence where nothing plays)
function buildMergedBuffer(ctx, tl, enBuf, esBuf) {
  const ref = enBuf || esBuf;
  const sr = ref.sampleRate;
  const len = Math.ceil(tl.total * sr);
  const buf = ctx.createBuffer(1, len, sr);
  const data = buf.getChannelData(0);
  if (enBuf) {
    const off = Math.round(tl.engAudioStart * sr);
    data.set(enBuf.getChannelData(0).subarray(0, Math.max(0, len - off)), off);
  }
  if (esBuf) {
    const off = Math.round(tl.spaAudioStart * sr);
    const d = esBuf.getChannelData(0);
    for (let i = 0; i < d.length && off + i < len; i++) data[off + i] = d[i];
  }
  return buf;
}

function scheduleAt(ctx, buffer, delaySec, dest) {
  const src = ctx.createBufferSource();
  src.buffer = buffer;
  src.connect(dest);
  src.connect(ctx.destination); // user hears narration while recording
  src.start(ctx.currentTime + Math.max(0, delaySec));
}

// ---------- MediaRecorder fallback (webm preferred: guaranteed audio) ----------

function recordWithMediaRecorder(canvas, c2d, o, enBuf, esBuf, audioCtx, setProgress) {
  return new Promise((resolve, reject) => {
    const stream = canvas.captureStream(FPS);
    const dest = audioCtx.createMediaStreamDestination();
    stream.addTrack(dest.stream.getAudioTracks()[0]);

    const list = ['video/webm;codecs=vp9,opus', 'video/webm;codecs=vp8,opus', 'video/webm', 'video/mp4'];
    const mime = list.find(m => MediaRecorder.isTypeSupported(m)) || 'video/webm';
    const rec = new MediaRecorder(stream, { mimeType: mime });
    const chunks = [];
    rec.ondataavailable = e => { if (e.data.size > 0) chunks.push(e.data); };
    rec.onstop = () => resolve(new Blob(chunks, { type: mime.split(';')[0] }));
    rec.onerror = e => reject(e.error || new Error('recorder error'));

    rec.start(200);

    if (audioCtx.state === 'suspended') audioCtx.resume().catch(() => {});
    if (enBuf) scheduleAt(audioCtx, enBuf, o.tl.engAudioStart, dest);
    if (esBuf) scheduleAt(audioCtx, esBuf, o.tl.spaAudioStart, dest);

    const t0 = performance.now();
    const tick = () => {
      const t = (performance.now() - t0) / 1000;
      drawScene(c2d, o.tl, {
        t, engWords: o.engWords, spaWords: o.spaWords,
        color: { eng: '#3B82F6', spa: '#22C55E' },
        engDur: o.engDur, spaDur: o.spaDur
      });
      setProgress(Math.min(95, Math.round((t / o.tl.total) * 90)));
      if (t >= o.tl.total) { rec.stop(); return; }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
}

// ---------- Hook ----------

export function useVideoExport() {
  const [exporting, setExporting] = useState(false);
  const [progress, setProgress] = useState(0);

  const generateVideo = useCallback(async (sentence, onDone) => {
    setExporting(true); setProgress(0);

    let audioCtx = null;
    try {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      if (audioCtx.state === 'suspended') { try { await audioCtx.resume(); } catch {} }

      const spanishText = translateSentence(sentence);
      const [enBuf, esBuf] = await Promise.all([
        fetchTTSBuffer(audioCtx, sentence, 'en').catch(() => null),
        fetchTTSBuffer(audioCtx, spanishText, 'es').catch(() => null)
      ]);
      if (!enBuf && !esBuf) throw new Error('no-audio');

      const engWords = sentence.split(' ');
      const spaWords = spanishText.split(' ');
      const engDur = enBuf ? enBuf.duration : 1.2;
      const spaDur = esBuf ? esBuf.duration : 1.2;
      const tl = buildTimeline(engWords, spaWords, engDur, spaDur);
      const sceneOpts = { engWords, spaWords, color: { eng: '#3B82F6', spa: '#22C55E' }, engDur, spaDur };

      const canvas = document.createElement('canvas');
      canvas.width = W; canvas.height = H;
      const c2d = canvas.getContext('2d');

      // Draw first frame before creating CanvasSource
      drawScene(c2d, tl, Object.assign({ t: 0 }, sceneOpts));

      let blob = null;
      // Primary path: mediabunny -> real MP4 (H.264 + AAC/Opus) with muxed audio
      try {
        const vCodec = await getFirstEncodableVideoCodec(['avc'], { width: W, height: H });
        const aCodec = await getFirstEncodableAudioCodec(['aac', 'opus']);
        if (!vCodec || !aCodec) throw new Error('codecs-unavailable');

        const output = new Output({ format: new Mp4OutputFormat(), target: new BufferTarget() });
        const videoSource = new CanvasSource(canvas, { codec: vCodec, bitrate: QUALITY_HIGH });
        output.addVideoTrack(videoSource, { frameRate: FPS });
        const audioSource = new AudioBufferSource({ codec: aCodec, bitrate: QUALITY_HIGH });
        output.addAudioTrack(audioSource);
        await output.start();

        const merged = buildMergedBuffer(audioCtx, tl, enBuf, esBuf);
        await audioSource.add(merged);

        const totalFrames = Math.ceil(tl.total * FPS);
        for (let f = 0; f < totalFrames; f++) {
          const t = f / FPS;
          drawScene(c2d, tl, Object.assign({ t }, sceneOpts));
          await videoSource.add(t, 1 / FPS);
          if (f % 15 === 0) {
            setProgress(Math.round((f / totalFrames) * 90));
            await new Promise(r => setTimeout(r));
          }
        }

        setProgress(95);
        await output.finalize();
        blob = new Blob([output.target.buffer], { type: 'video/mp4' });
      } catch (e) {
        console.warn('mediabunny path failed, using MediaRecorder fallback:', e);
      }

      // Fallback path: realtime MediaRecorder capture
      if (!blob) {
        blob = await recordWithMediaRecorder(
          canvas, c2d,
          { tl, engWords, spaWords, engDur, spaDur },
          enBuf, esBuf, audioCtx, setProgress
        );
      }

      const ext = blob.type.includes('mp4') ? 'mp4' : 'webm';
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'englishapp-' + Date.now() + '.' + ext;
      a.click();
      URL.revokeObjectURL(url);

      setProgress(100);
      onDone?.();
    } catch (err) {
      console.error('Video export failed:', err);
      alert('No se pudo generar el video. Verifica tu conexion e intenta de nuevo.');
      onDone?.();
    } finally {
      if (audioCtx) audioCtx.close().catch(() => {});
      setExporting(false);
    }
  }, []);

  return { generateVideo, exporting, progress };
}
