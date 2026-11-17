import { test, expect } from '@playwright/test';

test('two-finger touchpad swipes change one slide per gesture and preserve vertical scrolling', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('.site-preloader')).toHaveCount(0);
  await page.evaluate(() => {
    const close = () => document.querySelectorAll<HTMLDialogElement>('dialog[open]').forEach(dialog => dialog.close());
    new MutationObserver(close).observe(document.body, { subtree: true, attributes: true, attributeFilter: ['open'] });
    close();
  });
  for (const [selector, target] of [['.story', '.story-panel[aria-hidden="false"] h2'], ['#engineering-path', '.ke-composition']]) {
    const section = page.locator(selector);
    const surface = section.locator(target);
    await surface.scrollIntoViewIfNeeded();
    await surface.hover();
    const initial = Number(await section.getAttribute('data-active'));
    await page.mouse.wheel(90, 2);
    await expect(section).toHaveAttribute('data-active', String(initial + 1));
    // Momentum from the same gesture must not skip more slides.
    await page.mouse.wheel(70, 0);
    await page.mouse.wheel(40, 0);
    await expect(section).toHaveAttribute('data-active', String(initial + 1));
    await page.waitForTimeout(260);
    await page.mouse.wheel(-90, 0);
    await expect(section).toHaveAttribute('data-active', String(initial));
    await page.waitForTimeout(350);
    const before = await page.evaluate(() => scrollY);
    await page.mouse.wheel(0, 150);
    await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(before);
    await expect(section).toHaveAttribute('data-active', String(initial));
  }
});

for (const touch of [false, true]) {
  test(`homepage sections support ${touch ? 'finger' : 'mouse'} swipes`, async ({ browser }) => {
    const context = await browser.newContext({
      viewport: { width: touch ? 390 : 1440, height: 900 },
      isMobile: touch, hasTouch: touch, reducedMotion: 'reduce',
    });
    const page = await context.newPage();
    await page.goto('http://127.0.0.1:4174/');
    await expect(page.locator('.site-preloader')).toHaveCount(0);
    await page.evaluate(() => {
      const close = () => document.querySelectorAll<HTMLDialogElement>('dialog[open]').forEach(dialog => dialog.close());
      new MutationObserver(close).observe(document.body, { subtree: true, attributes: true, attributeFilter: ['open'] });
      close();
    });
    const cdp = touch ? await context.newCDPSession(page) : null;
    const gesture = async (x: number, y: number, dx: number, dy = 0) => {
      if (cdp) {
        await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] });
        for (let i = 1; i <= 6; i++) await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: x + dx * i / 6, y: y + dy * i / 6 }] });
        await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
      } else {
        await page.mouse.move(x, y);
        await page.mouse.down();
        await page.mouse.move(x + dx, y + dy, { steps: 6 });
        await page.mouse.up();
      }
    };
    for (const [selector, target, next] of [
      ['.story', '.story-panel[aria-hidden="false"] h2', 'Next approach'],
      ['#engineering-path', '.ke-composition', 'Next engineering stage'],
    ]) {
      const section = page.locator(selector);
      const area = section.locator(target);
      await area.scrollIntoViewIfNeeded();
      const bounds = (await area.boundingBox())!;
      const x = Math.min(bounds.x + bounds.width * .7, (touch ? 390 : 1440) - 30);
      const y = bounds.y + bounds.height / 2;
      const initial = Number(await section.getAttribute('data-active'));
      await gesture(x, y, -130);
      await expect(section).toHaveAttribute('data-active', String(initial + 1));
      await gesture(x - 130, y, 130);
      await expect(section).toHaveAttribute('data-active', String(initial));
      await gesture(x, y, -10);
      await expect(section).toHaveAttribute('data-active', String(initial));
      // A tap/click after dragging still activates the existing controls.
      await section.getByRole('button', { name: next, exact: true }).click();
      await expect(section).toHaveAttribute('data-active', String(initial + 1));
      if (touch) {
        const before = await page.evaluate(() => scrollY);
        await gesture(x, y, 3, -140);
        await expect(section).toHaveAttribute('data-active', String(initial + 1));
        await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(before);
      }
    }
    await context.close();
  });
}
