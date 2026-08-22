import { Mp3Encoder } from '@breezystack/lamejs';

// Encode a mono/stereo AudioBuffer to an MP3 Blob (128 kbps)
export function audioBufferToMp3(audioBuffer) {
  const numCh = Math.min(2, audioBuffer.numberOfChannels);
  const sampleRate = audioBuffer.sampleRate;
  const encoder = new Mp3Encoder(numCh, sampleRate, 128);

  const left = toInt16(audioBuffer.getChannelData(0));
  const right = numCh > 1 ? toInt16(audioBuffer.getChannelData(1)) : null;

  const blockSize = 1152;
  const chunks = [];

  for (let i = 0; i < left.length; i += blockSize) {
    const l = left.subarray(i, i + blockSize);
    const r = right ? right.subarray(i, i + blockSize) : null;
    const buf = r ? encoder.encodeBuffer(l, r) : encoder.encodeBuffer(l);
    if (buf.length > 0) chunks.push(new Int8Array(buf));
  }
  const end = encoder.flush();
  if (end.length > 0) chunks.push(new Int8Array(end));

  return new Blob(chunks, { type: 'audio/mpeg' });
}

function toInt16(float32Array) {
  const int16 = new Int16Array(float32Array.length);
  for (let i = 0; i < float32Array.length; i++) {
    const s = Math.max(-1, Math.min(1, float32Array[i]));
    int16[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
  }
  return int16;
}

// Merge multiple AudioBuffers sequentially into one mono AudioBuffer with gaps
export function mergeAudioBuffers(ctx, buffers, gapSeconds = 0.4) {
  const sampleRate = buffers[0].sampleRate;
  const gapSamples = Math.round(gapSeconds * sampleRate);
  let totalLen = gapSamples * (buffers.length - 1);
  for (const b of buffers) totalLen += b.length;

  const merged = ctx.createBuffer(1, totalLen, sampleRate);
  const data = merged.getChannelData(0);

  let offset = 0;
  for (let i = 0; i < buffers.length; i++) {
    // Average channels to mono
    const src = buffers[i];
    const srcData = src.getChannelData(0);
    data.set(srcData, offset);
    offset += src.length + gapSamples;
  }

  return merged;
}
