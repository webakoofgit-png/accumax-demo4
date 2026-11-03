import assert from 'node:assert/strict';
import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
const runtime = resolve('test-results/mobile-runtime');
mkdirSync(runtime, { recursive: true });
process.env.TEMP = runtime;
process.env.TMP = runtime;
const { chromium } = await import('@playwright/test');
const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', args: ['--single-process', '--no-zygote', '--disable-gpu'] });
const [width, height] = (process.env.MOBILE_KINETIC_SIZE ?? '390x844').split('x').map(Number);
const context = await browser.newContext({ reducedMotion: 'no-preference', hasTouch: true, isMobile: true, viewport: { width, height } });
const page = await context.newPage();
const until = async (check, label) => {
  const end = Date.now() + 6000;
  while (Date.now() < end) { if (await check()) return; await page.waitForTimeout(100); }
  throw new Error(label);
};
const errors = [];
page.on('pageerror', error => errors.push(error.message));
try {
  await page.goto('http://127.0.0.1:4174/');
  const section = page.locator('#engineering-path');
  await page.waitForSelector('#engineering-path[data-enhanced=true]');
  await page.waitForSelector('.site-preloader', { state: 'detached' });
  await page.evaluate(() => document.fonts.ready);
  await page.locator('.enquiry-popup').evaluate(dialog => {
    new MutationObserver(() => { if (dialog.open) dialog.close(); }).observe(dialog, { attributes: true, attributeFilter: ['open'] });
    if (dialog.open) dialog.close();
  });
  assert.equal(await page.locator(width <= 640 ? '.pin-spacer > .engineering-scroll-scene' : '#engineering-path .pin-spacer > .ke-surface').count(), 1);
  const metadata = await page.evaluate(async () => {
    const url = performance.getEntriesByType('resource').find(entry => entry.name.includes('/gsap_ScrollTrigger.js')).name;
    const { ScrollTrigger } = await import(url);
    const pin = ScrollTrigger.getById('kinetic-engineering');
    return { start: pin.start, end: pin.end };
  });
  assert(metadata.end - metadata.start >= 2800, 'Mobile stages need enough scroll distance to read');
  const positions = [.06, .22, .36, .5, .64, .79, .98];
  for (let index = 0; index < positions.length; index++) {
    await page.evaluate(top => window.scrollTo({ top, behavior: 'instant' }), metadata.start + (metadata.end - metadata.start) * positions[index]);
    await until(async () => await section.getAttribute('data-active') === String(index), `Wrong active stage ${index}`).catch(async error => {
      console.log(await page.evaluate(async () => {
        const url = performance.getEntriesByType('resource').find(entry => entry.name.includes('/gsap_ScrollTrigger.js')).name;
        const { ScrollTrigger } = await import(url);
        const pin = ScrollTrigger.getById('kinetic-engineering');
        return { scroll: scrollY, start: pin.start, end: pin.end, progress: pin.progress, active: document.querySelector('#engineering-path').dataset.active };
      }));
      throw error;
    });
    await until(() => section.locator('.ke-scene').nth(index).evaluate(element => {
      const letters = element.querySelectorAll('.ke-glyph,.ke-final-line>span');
      return Array.from(letters).every(letter => Math.abs(new DOMMatrix(getComputedStyle(letter).transform).m42) < 1);
    }), `Stage ${index} failed to settle into a readable word`);
    assert.equal(await section.locator('.ke-scene[aria-hidden="false"]').count(), 1, 'Mobile is showing a list instead of one stage');
    assert(await section.locator('.ke-scene').nth(index).evaluate(element => {
      const title = element.querySelector('h3'), description = element.querySelector('.ke-description');
      const surface = element.closest('.ke-surface').getBoundingClientRect(), heading = title.getBoundingClientRect(), copy = description.getBoundingClientRect();
      return title.scrollWidth <= title.clientWidth + 2 && heading.left >= surface.left && heading.right <= surface.right + 2 && copy.top >= heading.bottom && copy.bottom <= surface.bottom - 8;
    }), `Stage ${index} is clipped or overlapping`);
    if (index === 0 || index === 2 || index === 6) await page.screenshot({ path: `test-results/mobile-kinetic-${width}x${height}-${index}.png` });
  }
  await page.evaluate(top => window.scrollTo({ top, behavior: 'instant' }), metadata.end + 240);
  await until(() => section.locator('.ke-surface').evaluate(element => element.getBoundingClientRect().top < 0), 'Mobile pin failed to release');
  assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
  assert.deepEqual(errors, []);
  console.log(`Passed desktop-style mobile sequence, all six stages and finale: ${width}x${height}`);
} finally { await browser.close(); }
