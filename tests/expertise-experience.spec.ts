import { test, expect, type Page } from '@playwright/test';

async function categories(page: Page): Promise<Array<{title: string; short: string}>> {
  return page.evaluate(async () => { const route = '/src/data.ts'; return (await import(/* @vite-ignore */ route)).EXPERTISE_CATEGORIES; });
}

async function openExperience(page: Page) {
  await page.goto('/');
  await expect(page.locator('.site-preloader')).toHaveCount(0, { timeout: 10000 });
  await page.evaluate(() => document.fonts.ready);
  await page.locator('#expertise').evaluate(element => window.scrollTo({ top: scrollY + element.getBoundingClientRect().top - 80, behavior: 'instant' }));
  await expect(page.getByRole('tablist', { name: 'Engineering expertise' })).toBeVisible();
}

async function pins(page: Page) {
  return page.evaluate(async () => {
    const resource = performance.getEntriesByType('resource').find(entry => entry.name.includes('/gsap_ScrollTrigger.js'));
    if (!resource) return [];
    const { ScrollTrigger } = await import(/* @vite-ignore */ resource.name);
    return ScrollTrigger.getAll().filter((trigger: { pin?: unknown }) => trigger.pin).map((trigger: { trigger: HTMLElement; start: number; end: number }) => ({ name: trigger.trigger.className, start: trigger.start, end: trigger.end }));
  });
}

test('desktop hotspots retain all services, crossfade images, navigate by keyboard and clean up', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await openExperience(page);
  const EXPERTISE_CATEGORIES = await categories(page);
  const reel = (await pins(page)).find(pin => pin.name === 'expertise-console')!;
  expect(reel).toBeTruthy();
  expect(reel.end - reel.start).toBeLessThanOrEqual(840);
  await page.evaluate(top => window.scrollTo({ top, behavior: 'instant' }), reel.start + 1);
  await expect(page.locator('#expertise [role=tab]')).toHaveCount(EXPERTISE_CATEGORIES.length);
  const consoleHeight = await page.locator('.expertise-console').evaluate(element => element.getBoundingClientRect().height);
  for (let i = 0; i < EXPERTISE_CATEGORIES.length; i++) {
    const item = EXPERTISE_CATEGORIES[i];
    const tab = page.getByRole('tab', { name: item.title, exact: true });
    await tab.click();
    await expect(tab).toHaveAttribute('aria-selected', 'true');
    await expect(page.locator('#expertise [role=tabpanel] h3')).toHaveText(item.title);
    await expect(page.locator('.expertise-description-inner')).toHaveText(item.short);
    await expect(page.locator('.expertise-image-window img').nth(i)).toHaveCSS('opacity', '1');
    expect(await page.locator('.expertise-image-window img').nth(i).evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBeTruthy();
    expect(Math.abs(await page.locator('.expertise-console').evaluate(element => element.getBoundingClientRect().height) - consoleHeight)).toBeLessThan(1.5);
  }
  await page.getByRole('tab', { name: EXPERTISE_CATEGORIES[6].title }).focus();
  await page.keyboard.press('Home');
  await expect(page.getByRole('tab', { name: EXPERTISE_CATEGORIES[0].title })).toBeFocused();
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('tab', { name: EXPERTISE_CATEGORIES[1].title })).toBeFocused();
  await expect(page.locator('.expertise-explore')).toHaveAttribute('href', '/services/solar-ev-station');
  await page.getByRole('tab', { name: EXPERTISE_CATEGORIES[2].title }).hover();
  await expect(page.getByRole('tab', { name: EXPERTISE_CATEGORIES[2].title })).toHaveAttribute('aria-selected', 'true');
  expect(await page.evaluate(() => document.body.scrollWidth <= innerWidth)).toBeTruthy();
  await page.screenshot({ path: 'test-results/expertise-desktop.png' });
  await page.evaluate(top => window.scrollTo({ top, behavior: 'instant' }), reel.end - 5);
  await expect(page.locator('#expertise [role=tabpanel] h3')).toHaveText(EXPERTISE_CATEGORIES[6].title);
  await expect(page.locator('.expertise-explore')).toHaveAttribute('href', '/services/export');
  await page.locator('.expertise-explore').click();
  await expect(page).toHaveURL(/\/services\/export$/);
  await expect(page.locator('#expertise')).toHaveCount(0);
  expect((await pins(page)).some(pin => pin.name === 'expertise-console')).toBeFalsy();
  expect(errors).toEqual([]);
});

test.describe('touch expertise', () => {
  test.use({ hasTouch: true, isMobile: true });
  for (const width of [320, 390, 768, 1024]) {
    test(`swipeable selector at ${width}px has no forced pin or page overflow`, async ({ page }) => {
      await page.setViewportSize({ width, height: 1000 });
      await openExperience(page);
      const EXPERTISE_CATEGORIES = await categories(page);
      expect((await pins(page)).some(pin => pin.name === 'expertise-console')).toBeFalsy();
      const first = page.getByRole('tab', { name: EXPERTISE_CATEGORIES[0].title });
      await first.click();
      await expect(first).toHaveAttribute('aria-selected', 'true');
      const stage = page.locator('.expertise-visual');
      await stage.scrollIntoViewIfNeeded();
      const box = (await stage.boundingBox())!;
      const session = await page.context().newCDPSession(page);
      const x = box.x + box.width * .8, y = box.y + box.height / 2;
      await session.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] });
      for (let i = 1; i <= 10; i++) await session.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: x - i * 12, y }] });
      await session.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
      await expect(page.getByRole('tab', { name: EXPERTISE_CATEGORIES[1].title })).toHaveAttribute('aria-selected', 'true');
      await page.getByRole('button', { name: 'Next expertise', exact: true }).click();
      await expect(page.locator('#expertise [role=tabpanel] h3')).toHaveText(EXPERTISE_CATEGORIES[2].title);
      await page.getByRole('button', { name: 'Previous expertise', exact: true }).click();
      await expect(page.locator('#expertise [role=tabpanel] h3')).toHaveText(EXPERTISE_CATEGORIES[1].title);
      await expect(page.locator('.expertise-explore')).toHaveAttribute('href', '/services/solar-ev-station');
      expect(await page.evaluate(() => document.body.scrollWidth <= innerWidth)).toBeTruthy();
      await page.screenshot({ path: `test-results/expertise-touch-${width}.png` });
    });
  }
});

test('reduced motion preserves immediate service switching without tilt or pinning', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await openExperience(page);
  const EXPERTISE_CATEGORIES = await categories(page);
  expect((await pins(page)).some(pin => pin.name === 'expertise-console')).toBeFalsy();
  await page.getByRole('tab', { name: EXPERTISE_CATEGORIES[4].title }).click();
  await expect(page.locator('.expertise-image-window img').nth(4)).toHaveCSS('opacity', '1');
  await expect(page.locator('.expertise-explore')).toHaveAttribute('href', /\/contact\?service=Live%20Electrical%20Panel%20Cleaning/);
  await expect(page.locator('.expertise-visual')).toHaveCSS('transform', 'none');
});
