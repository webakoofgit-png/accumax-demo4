import { chromium } from '@playwright/test';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const input = resolve('src/assets/home banners/home page banner video.mp4');
const output = resolve('src/assets/home banners/home-banner-web.mp4');
const source = `data:video/mp4;base64,${readFileSync(input).toString('base64')}`;
const browser = await chromium.launch({
  executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE || 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: true,
});

try {
  const page = await browser.newPage();
  const result = await page.evaluate(async source => {
    const type = 'video/mp4;codecs=avc1.42001E';
    if (!MediaRecorder.isTypeSupported(type)) throw new Error('H.264 MP4 recording is unavailable');
    const video = document.createElement('video');
    video.muted = true;
    video.playsInline = true;
    video.src = source;
    await new Promise((resolve, reject) => {
      video.onloadeddata = resolve;
      video.onerror = () => reject(new Error('Cannot decode the source video'));
    });
    const canvas = document.createElement('canvas');
    canvas.width = 1440;
    canvas.height = 600;
    const context = canvas.getContext('2d');
    const stream = canvas.captureStream(24);
    const recorder = new MediaRecorder(stream, { mimeType: type, videoBitsPerSecond: 1800000 });
    const chunks = [];
    const done = new Promise((resolve, reject) => {
      recorder.ondataavailable = event => { if (event.data.size) chunks.push(event.data); };
      recorder.onstop = resolve;
      recorder.onerror = () => reject(new Error('Video recording failed'));
    });
    let frame;
    const draw = () => {
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      frame = requestAnimationFrame(draw);
    };
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    video.onended = () => { cancelAnimationFrame(frame); recorder.stop(); };
    recorder.start();
    await video.play();
    draw();
    await done;
    stream.getTracks().forEach(track => track.stop());
    const data = new Uint8Array(await new Blob(chunks, { type: 'video/mp4' }).arrayBuffer());
    let binary = '';
    for (let offset = 0; offset < data.length; offset += 16384) binary += String.fromCharCode(...data.subarray(offset, offset + 16384));
    return { base64: btoa(binary), sourceDuration: video.duration, width: canvas.width, height: canvas.height };
  }, source);
  const data = Buffer.from(result.base64, 'base64');
  writeFileSync(output, data);
  console.log(JSON.stringify({ output, bytes: data.length, duration: result.sourceDuration, width: result.width, height: result.height }));
} finally {
  await browser.close();
}
