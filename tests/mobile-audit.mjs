import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

// Keep this QA process's temporary browser data on the project drive.
const runtime = resolve('test-results/mobile-runtime');
mkdirSync(runtime, { recursive: true });
process.env.TEMP = runtime;
process.env.TMP = runtime;
const { chromium } = await import('@playwright/test');
const light = process.env.MOBILE_AUDIT_LIGHT === '1';
const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', args: light ? ['--single-process', '--no-zygote', '--disable-gpu'] : [] });
const context = await browser.newContext({ isMobile: true, hasTouch: true, reducedMotion: 'reduce', viewport: { width: 320, height: 800 } });
await context.addInitScript(() => {
  window.addEventListener('DOMContentLoaded', () => {
    new MutationObserver(records => {
      for (const { target } of records) if (target instanceof HTMLDialogElement && target.matches('.enquiry-popup[open]')) target.close();
    }).observe(document.documentElement, { subtree: true, attributes: true, attributeFilter: ['open'] });
  });
});
const page = await context.newPage();
if (light) await page.route('**/*', route => {
  const request = route.request();
  if (request.resourceType() === 'image' && !request.url().includes('/logo')) return route.fulfill({ contentType: 'image/svg+xml', body: '<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1000"/>' });
  return route.continue();
});
const widths = process.env.AUDIT_WIDTHS?.split(',').map(Number) ?? [320, 360, 375, 390, 414, 480, 600, 768, 820, 1024];
const routes = process.env.AUDIT_ROUTES?.split(',') ?? ['/', '/about', '/services', '/industries', '/projects', '/quality-safety', '/gallery', '/videos', '/catalogue', '/careers', '/contact', '/services/substation-testing-commissioning', '/projects/gis-substation-erection'];
const results = [];
const errors = [];
const report = resolve('test-results', process.env.AUDIT_REPORT ?? 'mobile-audit.json');
page.on('pageerror', error => errors.push(error.message));
try {
  for (const width of widths) {
    await page.setViewportSize({ width, height: width > 850 ? 768 : 844 });
    for (const route of routes) {
      await page.goto('http://127.0.0.1:4174' + route);
      await page.waitForSelector('main');
      await page.waitForSelector('.site-preloader', { state: 'detached', timeout: 10000 });
      await page.evaluate(() => document.fonts.ready);
      const result = await page.evaluate(() => {
        const bad = [];
        const intentional = '.iw-selector,.expertise-hotspots,.marquee,.service-preview,.hero-banner-image';
        for (const element of document.querySelectorAll('main h1,main h2,main h3,main p,main input,main select,main textarea,main button,.header')) {
          const box = element.getBoundingClientRect();
          const style = getComputedStyle(element);
          if (!box.width || !box.height || style.visibility === 'hidden' || element.closest('.ke-sr-only,.sr-only,[hidden],dialog:not([open]),' + intentional)) continue;
          if (box.left < -2 || box.right > innerWidth + 2 || (element.matches('h1,h2,h3,p') && element.scrollWidth > element.clientWidth + 3)) {
            bad.push({ tag: element.tagName, cls: element.className, text: element.textContent?.trim().slice(0, 80), left: Math.round(box.left), right: Math.round(box.right), scroll: element.scrollWidth, client: element.clientWidth, font: style.fontSize, parent: element.parentElement?.className, parentWidth: Math.round(element.parentElement?.getBoundingClientRect().width ?? 0) });
          }
        }
        return { overflow: document.documentElement.scrollWidth - innerWidth, bad };
      });
      const row = { width, route, ...result };
      results.push(row);
      writeFileSync(report, JSON.stringify({ light, results, errors }, null, 2));
      if (row.overflow > 1 || row.bad.length) console.log(JSON.stringify(row));
    }
    console.log(`Checked ${width}px`);
  }
  writeFileSync(report, JSON.stringify({ light, results, errors }, null, 2));
  console.log(JSON.stringify({ checked: results.length, problems: results.filter(row => row.overflow > 1 || row.bad.length).length, errors }));
} finally { await browser.close(); }
