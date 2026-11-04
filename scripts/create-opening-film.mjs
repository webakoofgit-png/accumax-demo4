import { chromium } from '@playwright/test';
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

// A 12-second silent film made only from the project's existing imagery.
const sources = [
  ['src/assets/home banners/banner1.png', 'image/png'],
  ['src/assets/images/gallery/9.jpg', 'image/jpeg'],
  ['src/assets/images/hero-testing.jpg', 'image/jpeg'],
  ['src/assets/images/products/solar-and-ev-station.jpg', 'image/jpeg'],
].map(([path, type]) => `data:${type};base64,${readFileSync(resolve(path)).toString('base64')}`);
const browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  const encoded = await page.evaluate(async sources => {
    const canvas = document.createElement('canvas');
    canvas.width = 1280; canvas.height = 720;
    const context = canvas.getContext('2d');
    const images = await Promise.all(sources.map(source => new Promise((resolve, reject) => {
      const image = new Image(); image.onload = () => resolve(image); image.onerror = reject; image.src = source;
    })));
    const draw = (image, progress, opacity = 1) => {
      const scale = Math.max(canvas.width / image.width, canvas.height / image.height) * (1.04 + progress * .035);
      const width = image.width * scale, height = image.height * scale;
      context.globalAlpha = opacity;
      context.drawImage(image, (canvas.width - width) / 2 + progress * 10, (canvas.height - height) / 2, width, height);
    };
    const stream = canvas.captureStream(24);
    const recorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp9', videoBitsPerSecond: 2200000 });
    const chunks = [];
    recorder.ondataavailable = event => { if (event.data.size) chunks.push(event.data); };
    const done = new Promise(resolve => { recorder.onstop = resolve; });
    draw(images[0], 0);
    recorder.start();
    const start = performance.now();
    await new Promise(resolve => {
      const tick = () => {
        const elapsed = Math.min(12, (performance.now() - start) / 1000);
        const index = Math.min(3, Math.floor(elapsed / 3));
        const local = (elapsed - index * 3) / 3;
        context.globalAlpha = 1; context.fillStyle = '#242522'; context.fillRect(0, 0, canvas.width, canvas.height);
        draw(images[index], local);
        if (index > 0 && local < .22) draw(images[index - 1], 1, 1 - local / .22);
        context.globalAlpha = 1;
        if (elapsed >= 12) { recorder.stop(); resolve(); } else requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
    await done;
    stream.getTracks().forEach(track => track.stop());
    const bytes = new Uint8Array(await new Blob(chunks, { type: 'video/webm' }).arrayBuffer());
    let binary = '';
    for (let i = 0; i < bytes.length; i += 8192) binary += String.fromCharCode(...bytes.subarray(i, i + 8192));
    return btoa(binary);
  }, sources);
  mkdirSync(resolve('src/assets/opening'), { recursive: true });
  writeFileSync(resolve('src/assets/opening/acpl-opening.webm'), Buffer.from(encoded, 'base64'));
  process.stdout.write('Created 12-second ACPL opening film from existing project imagery.\n');
} finally { await browser.close(); }
