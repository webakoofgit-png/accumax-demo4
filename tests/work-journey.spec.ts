import { test, expect, type Page } from '@playwright/test';

async function openHome(page: Page) {
  await page.goto('/');
  await expect(page.locator('.site-preloader')).toHaveCount(0, { timeout: 10000 });
  await page.evaluate(() => document.fonts.ready);
}

async function scrollTo(page: Page, selector: string) {
  await page.locator(selector).evaluate(element => window.scrollTo({ top: scrollY + element.getBoundingClientRect().top - 100, behavior: 'instant' }));
}

async function journeyTriggers(page: Page) {
  return page.evaluate(async () => {
    const url = performance.getEntriesByType('resource').find(entry => entry.name.includes('/gsap_ScrollTrigger.js'))?.name;
    if (!url) return [];
    const { ScrollTrigger } = await import(/* @vite-ignore */ url);
    return ScrollTrigger.getAll().filter((trigger: { trigger?: HTMLElement }) => trigger.trigger?.closest('#work-journey')).map((trigger: { trigger?: HTMLElement; start: number; end: number; pin?: unknown }) => ({ name: trigger.trigger?.className, start: trigger.start, end: trigger.end, pin: Boolean(trigger.pin) }));
  });
}

test('six original stages, curved scroll progress, photos, completion and preserved links', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await openHome(page);
  const expectedNames = await page.locator('#engineering-path .ke-process .ke-word').allTextContents();
  const expectedDescriptions = await page.locator('#engineering-path .ke-process .ke-description').allTextContents();
  expect(await page.locator('.journey-milestone h3').allTextContents()).toEqual(expectedNames.map(name => name + '.'));
  expect(await page.locator('.journey-primary').allTextContents()).toEqual(expectedDescriptions);
  await expect(page.locator('#work-journey .journey-link[href="/quality-safety"]')).toHaveCount(1);
  await expect(page.locator('#work-journey .journey-link[href="/services/export"]')).toHaveCount(1);
  await expect(page.locator('.journey-result-cta')).toHaveAttribute('href', '/services');
  expect((await journeyTriggers(page)).every(trigger => !trigger.pin)).toBeTruthy();
  await expect(page.locator('#work-journey details')).toHaveCount(0);

  const route = (await journeyTriggers(page)).find(trigger => trigger.name === 'journey-track')!;
  await page.evaluate(top => window.scrollTo({ top, behavior: 'instant' }), route.start + (route.end - route.start) * .45);
  await expect.poll(() => page.locator('.journey-route-progress').evaluate(element => parseFloat(getComputedStyle(element).strokeDashoffset))).toBeLessThan(.7);
  expect(await page.locator('.journey-route-progress').evaluate(element => parseFloat(getComputedStyle(element).strokeDashoffset))).toBeGreaterThan(.2);
  await expect(page.locator('.journey-route-progress')).toHaveAttribute('d', /C/);
  for (let index = 0; index < 6; index++) {
    await scrollTo(page, `.milestone-${index}`);
    const row = page.locator(`.milestone-${index}`);
    await expect(row.locator('.journey-image-mask')).toHaveCSS('clip-path', 'inset(0px)');
    await expect(row.locator('.journey-primary')).toHaveCSS('opacity', '1');
    await expect.poll(() => row.locator('img').evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBeTruthy();
    expect(await page.evaluate(() => document.body.scrollWidth <= innerWidth)).toBeTruthy();
  }
  await page.locator('.journey-completion').scrollIntoViewIfNeeded();
  await expect(page.locator('.journey-ring-progress')).toHaveCSS('stroke-dashoffset', '0px');
  await expect(page.locator('.journey-result-cta')).toHaveCSS('opacity', '1');
  await expect(page.locator('.journey-milestone').first()).toHaveAttribute('data-phase', 'past');
  await page.screenshot({ path: 'test-results/work-journey-completion.png' });
  await page.locator('.journey-result-cta').click();
  await expect(page).toHaveURL(/\/services$/);
  expect(await journeyTriggers(page)).toHaveLength(0);
  expect(errors).toEqual([]);
});

for (const width of [320, 390, 768, 1024]) {
  test(`journey at ${width}px stays readable, continuous and free of scroll traps`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    await openHome(page);
    await expect(page.locator('.journey-milestone')).toHaveCount(6);
    await scrollTo(page, '.milestone-0');
    await expect(page.locator('.milestone-0 .journey-primary')).toHaveCSS('opacity', '1');
    const shapeBefore = await page.locator('.journey-route-progress').getAttribute('d');
    for (const index of [1, 3, 5]) {
      await scrollTo(page, `.milestone-${index}`);
      await expect(page.locator(`.milestone-${index} .journey-image-mask`)).toHaveCSS('clip-path', 'inset(0px)');
      expect(await page.evaluate(() => document.body.scrollWidth <= innerWidth)).toBeTruthy();
    }
    expect((await journeyTriggers(page)).some(trigger => trigger.pin)).toBeFalsy();
    await page.setViewportSize({ width: width === 320 ? 360 : width - 30, height: 844 });
    await expect.poll(() => page.locator('.journey-route-progress').getAttribute('d')).not.toBe(shapeBefore);
    await page.locator('.journey-result-cta').focus();
    await expect(page.locator('.journey-result-cta')).toBeFocused();
    await expect(page.locator('.journey-result-cta')).toHaveCSS('opacity', '1');
    expect(await page.locator('.journey-route-progress').evaluate((path: SVGPathElement) => path.getTotalLength())).toBeGreaterThan(1000);
  });
}

test('reduced motion shows the entire journey and completion immediately', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await openHome(page);
  expect(await journeyTriggers(page)).toHaveLength(0);
  await expect(page.locator('#work-journey')).toHaveAttribute('data-motion', 'reduced');
  for (const row of await page.locator('.journey-milestone').all()) {
    await expect(row.locator('.journey-primary')).toHaveCSS('opacity', '1');
    await expect(row.locator('.journey-image-mask')).toHaveCSS('clip-path', 'none');
  }
  await expect(page.locator('.journey-ring-progress')).toHaveCSS('stroke-dashoffset', '0px');
  await expect(page.locator('.journey-result-cta')).toHaveCSS('opacity', '1');
});
