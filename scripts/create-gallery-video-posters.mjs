import { chromium } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';

const folder = 'public/videos/posters';
mkdirSync(folder, { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
try {
  const page = await browser.newPage();
  await page.route('**/*', route => route.request().resourceType() === 'document' ? route.continue() : route.abort());
  await page.goto('https://www.accumaxcontrols.com/videos.php', { waitUntil: 'domcontentloaded' });
  await page.setContent('<!doctype html><html><body></body></html>');
  await page.unroute('**/*');
  for (let number = 1; number <= 5; number++) {
    const result = await page.evaluate(async number => {
      const video = document.createElement('video');
      video.muted = true;
      video.preload = 'auto';
      document.body.append(video);
      let timer;
      try {
        await new Promise((resolve, reject) => {
          timer = setTimeout(() => reject(new Error(`Video ${number} did not load`)), 45000);
          video.onloadeddata = resolve;
          video.onerror = () => reject(new Error(`Video ${number}: ${video.error?.message}`));
          video.src = `https://www.accumaxcontrols.com/${number}.mp4`;
        });
        clearTimeout(timer);
        const canvas = document.createElement('canvas');
        const scale = Math.min(1, 800 / video.videoWidth, 450 / video.videoHeight);
        canvas.width = Math.round(video.videoWidth * scale);
        canvas.height = Math.round(video.videoHeight * scale);
        canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
        return { poster: canvas.toDataURL('image/jpeg', .85).split(',')[1], width: video.videoWidth, height: video.videoHeight, duration: video.duration };
      } finally {
        clearTimeout(timer);
        video.removeAttribute('src');
        video.load();
        video.remove();
      }
    }, number);
    const path = `${folder}/accumax-video-${number}.jpg`;
    writeFileSync(path, Buffer.from(result.poster, 'base64'));
    console.log(JSON.stringify({ number, path, width: result.width, height: result.height, duration: result.duration }));
  }
} finally {
  await browser.close();
}
