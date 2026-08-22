import { MP3Encoder } from 'lamejs';

export function blobToAudioBuffer(blob) {
  return new Promise(async (resolve, reject) => {
    try {
      const arrayBuffer = await blob.arrayBuffer();
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
      audioCtx.close();
      resolve(audioBuffer);
    } catch (e) {
      reject(e);
    }
  });
}

export function audioBufferToMp3(audioBuffer) {
  const sampleRate = audioBuffer.sampleRate;
  const channels = audioBuffer.numberOfChannels;
  const mp3Encoder = new MP3Encoder(channels, sampleRate, 128);
  const mp3Data = [];

  const left = audioBuffer.getChannelData(0);
  const right = channels > 1 ? audioBuffer.getChannelData(1) : left;

  const blockSize = 1152;
  for (let i = 0; i < left.length; i += blockSize) {
    const leftChunk = left.subarray(i, i + blockSize);
    const rightChunk = right.subarray(i, i + blockSize);
    const mp3buf = channels > 1
      ? mp3Encoder.encodeBuffer(leftChunk, rightChunk)
      : mp3Encoder.encodeBuffer(leftChunk);
    if (mp3buf.length > 0) mp3Data.push(mp3buf);
  }

  mp3Data.push(mp3Encoder.flush());
  return new Blob(mp3Data, { type: 'audio/mp3' });
}

export async function webmBlobToMp3(webmBlob) {
  const audioBuffer = await blobToAudioBuffer(webmBlob);
  return audioBufferToMp3(audioBuffer);
}
