import { test, expect, type Page } from '@playwright/test';

const titles = ['Understand', 'Plan', 'Engineer', 'Execute', 'Test', 'Deliver'];
const descriptions = [
  'Define scope, interfaces and operating requirements.',
  'Coordinate resources, procurement and site activities.',
  'Develop the engineering approach and protection requirements.',
  'Bring equipment, civil works and electrical systems together.',
  'Check installation, control logic and system performance.',
  'Review documentation and prepare the handover.',
];
async function openHome(page: Page) {
  await page.goto('/');
  await expect(page.locator('#engineering-path')).toBeAttached({ timeout: 20000 });
  await expect(page.locator('.site-preloader')).toHaveCount(0);
  await page.evaluate(() => document.fonts.ready);
}
async function progressTo(page: Page, progress: number) {
  await page.locator('#engineering-path').evaluate((element, value) => {
    const top = parseFloat(getComputedStyle(element).getPropertyValue('--ke-pin-top')) || 76;
    const start = scrollY + element.getBoundingClientRect().top - top;
    const surface = element.querySelector<HTMLElement>('.ke-surface')!;
    const compact = matchMedia('(max-width: 900px), (hover: none), (pointer: coarse)').matches;
    const distance = compact ? Math.max(1800, surface.offsetHeight * 3.7) : Math.max(2400, innerHeight * 3.4);
    window.scrollTo({ top: start + distance * value, behavior: 'instant' });
  }, progress);
}

test('upstream layout changes never pin engineering over the expertise section', async ({ page }) => {
  await page.setViewportSize({ width: 1536, height: 720 });
  await openHome(page);
  const section = page.locator('#engineering-path');
  await expect(page.locator('.project-showcase-category,.perspective-service-meta')).toHaveCount(0);
  expect(await section.evaluate(element => element.previousElementSibling?.id)).toBe('expertise');
  const original = await page.locator('#expertise').evaluate(element => getComputedStyle(element).paddingBottom);
  await page.locator('#expertise').evaluate(element => {
    element.style.paddingBottom = `${parseFloat(getComputedStyle(element).paddingBottom) + 600}px`;
  });
  await section.evaluate(element => window.scrollTo({ top: scrollY + element.getBoundingClientRect().top - 236, behavior: 'instant' }));
  await expect.poll(() => page.evaluate(() => {
    const industry = document.querySelector('#expertise')!.getBoundingClientRect();
    const surface = document.querySelector('.ke-surface')!.getBoundingClientRect();
    return surface.top - industry.bottom;
  })).toBeGreaterThanOrEqual(-1);
  await expect(section).toHaveAttribute('data-active', '0');
  await progressTo(page, .36);
  await expect(section).toHaveAttribute('data-active', '2');
  await expect.poll(() => section.locator('.ke-surface').evaluate(element => element.getBoundingClientRect().top)).toBeCloseTo(76, 0);
  await page.locator('#expertise').evaluate((element, value) => { element.style.paddingBottom = value; }, original);
  await section.evaluate(element => window.scrollTo({ top: scrollY + element.getBoundingClientRect().top - 156, behavior: 'instant' }));
  await expect.poll(() => page.evaluate(() => document.querySelector('.ke-surface')!.getBoundingClientRect().top - document.querySelector('#expertise')!.getBoundingClientRect().bottom)).toBeGreaterThanOrEqual(-1);
  await expect(section).toHaveAttribute('data-active', '0');
});

test('kinetic desktop plays six typography stages, finale and releases the pin', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await openHome(page);
  const section = page.locator('#engineering-path');
  await expect(section).toHaveAttribute('data-enhanced', 'true');
  await expect(section.locator('.ke-header .eyebrow')).toHaveCSS('font-size', '12px');
  await expect(section.locator('.ke-surface')).toHaveCSS('background-image', /background.*\.png/);
  await expect(section.locator('.ke-edition,.ke-coordinate,.ke-footer-meta')).toHaveCount(0);
  expect(await section.locator('.ke-process .ke-word').allTextContents()).toEqual(titles);
  expect(await section.locator('.ke-process .ke-description').allTextContents()).toEqual(descriptions);
  await expect(section.locator('img, svg, button')).toHaveCount(0);
  const checkpoints = [.06, .22, .36, .5, .64, .79];
  for (let index = 0; index < checkpoints.length; index++) {
    await progressTo(page, checkpoints[index]);
    await expect(section).toHaveAttribute('data-active', String(index));
    const scene = section.locator('.ke-process').nth(index);
    await expect(scene).toHaveAttribute('aria-hidden', 'false');
    await expect(scene).toHaveCSS('opacity', '1');
    await expect.poll(() => scene.locator('.ke-glyph').first().evaluate(element => Math.abs(new DOMMatrix(getComputedStyle(element).transform).m42))).toBeLessThan(1);
    expect(await scene.locator('.ke-word').evaluate(element => element.scrollWidth <= element.clientWidth + 2)).toBeTruthy();
    if (index === 2) {
      await page.locator('.enquiry-popup').evaluate((element: HTMLDialogElement) => element.close());
      await page.screenshot({ path: 'test-results/kinetic-engineering-desktop.png' });
    }
  }
  await progressTo(page, .98);
  await expect(section).toHaveAttribute('data-active', '6');
  await expect(section.locator('.ke-finale')).toHaveCSS('opacity', '1');
  await expect.poll(() => section.locator('.ke-final-line>span').last().evaluate(element => Math.abs(new DOMMatrix(getComputedStyle(element).transform).m42))).toBeLessThan(1);
  await page.locator('.enquiry-popup').evaluate((element: HTMLDialogElement) => element.close());
  await page.screenshot({ path: 'test-results/kinetic-engineering-finale.png' });
  await progressTo(page, .22);
  await expect(section).toHaveAttribute('data-active', '1');
  await expect.poll(() => section.locator('.ke-counter-track').evaluate(element => new DOMMatrix(getComputedStyle(element).transform).m42)).toBeCloseTo(-32, 0);
  await expect.poll(() => section.locator('.ke-process').nth(1).locator('.ke-glyph').first().evaluate(element => Math.abs(new DOMMatrix(getComputedStyle(element).transform).m42))).toBeLessThan(1);
  await progressTo(page, .98);
  await expect(section).toHaveAttribute('data-active', '6');
  await progressTo(page, 1.1);
  expect(await section.locator('.ke-surface').evaluate(element => element.getBoundingClientRect().top)).toBeLessThan(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
  await page.locator('.header a[href="/contact"]').click();
  await expect(section).toHaveCount(0);
  await expect(page.locator('.pin-spacer:has(.ke-surface)')).toHaveCount(0);
  expect(errors).toEqual([]);
});

for (const width of [320, 390, 768]) {
  test(`kinetic mobile/tablet at ${width}px shows one complete stage at a time`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await openHome(page);
    const section = page.locator('#engineering-path');
    await expect(section).toHaveAttribute('data-enhanced', 'true');
    await expect(section.locator('.pin-spacer')).toHaveCount(1);
    expect(await section.locator('.ke-process .ke-description').allTextContents()).toEqual(descriptions);
    const checkpoints = [.06, .22, .36, .5, .64, .79];
    for (let index = 0; index < checkpoints.length; index++) {
      await progressTo(page, checkpoints[index]);
      await expect(section).toHaveAttribute('data-active', String(index));
      const scene = section.locator('.ke-process').nth(index);
      await expect(scene).toHaveCSS('opacity', '1');
      await expect.poll(() => scene.locator('.ke-glyph').evaluateAll(elements => elements.every(element => Math.abs(new DOMMatrix(getComputedStyle(element).transform).m42) < 1))).toBeTruthy();
      expect(await scene.locator('.ke-word').evaluate(element => element.scrollWidth <= element.clientWidth + 2 && element.getBoundingClientRect().right <= innerWidth)).toBeTruthy();
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
    await page.locator('.enquiry-popup').evaluate((element: HTMLDialogElement) => element.close());
    await page.screenshot({ path: `test-results/kinetic-engineering-${width}.png` });
  });
}

test('reduced motion and resizing restore all descriptions without pinning', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await openHome(page);
  await progressTo(page, .36);
  await expect(page.locator('#engineering-path')).toHaveAttribute('data-active', '2');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const section = page.locator('#engineering-path');
  await expect(section).not.toHaveAttribute('data-enhanced');
  await expect(section.locator('.pin-spacer')).toHaveCount(0);
  for (const scene of await section.locator('.ke-process').all()) {
    await expect(scene).not.toHaveAttribute('aria-hidden');
    await expect(scene).toHaveCSS('opacity', '1');
    await expect(scene.locator('.ke-description')).toHaveCSS('opacity', '1');
  }
  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
});
