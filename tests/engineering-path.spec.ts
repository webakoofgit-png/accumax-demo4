import { test, expect } from '@playwright/test';

for (const width of [390, 1440]) {
  test(`engineering stages are optional and never hold page scrolling at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    await expect(page.locator('.site-preloader')).toHaveCount(0);
    await page.locator('.enquiry-popup').evaluate((dialog: HTMLDialogElement) => {
      new MutationObserver(() => { if (dialog.open) dialog.close(); }).observe(dialog, { attributes: true, attributeFilter: ['open'] });
      if (dialog.open) dialog.close();
    });
    const section = page.locator('#engineering-path');
    await expect(page.locator('.pin-spacer:has(#engineering-path)')).toHaveCount(0);
    await expect(section).toHaveAttribute('data-active', '0');
    await expect(page.getByRole('button', { name: /^(Previous|Next) engineering stage$/ })).toHaveCount(2);
    await expect(page.getByRole('button', { name: /^(Pause|Play) engineering stages$/ })).toHaveCount(0);
    await page.getByRole('button', { name: 'Next engineering stage', exact: true }).click();
    await expect(section).toHaveAttribute('data-active', '1');
    await page.getByRole('button', { name: 'Previous engineering stage', exact: true }).click();
    await expect(section).toHaveAttribute('data-active', '0');
    await page.getByRole('button', { name: 'Show Plan', exact: true }).click();
    await expect(section).toHaveAttribute('data-active', '1');
    await expect(section.getByRole('heading', { name: 'Plan', exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'Show Deliver', exact: true }).focus();
    await page.keyboard.press('Enter');
    await expect(section).toHaveAttribute('data-active', '5');
    await page.getByRole('button', { name: 'Show Every connection', exact: true }).click();
    await expect(section).toHaveAttribute('data-active', '6');
    await expect(section.locator('.ke-finale')).toBeVisible();
    await page.getByRole('button', { name: 'Show Understand', exact: true }).click();
    await section.evaluate(element => window.scrollTo({ top: scrollY + element.getBoundingClientRect().top - 90, behavior: 'instant' }));
    const before = await section.evaluate(element => element.getBoundingClientRect().top);
    await page.mouse.move(width - 20, 300);
    await page.mouse.wheel(0, 600);
    await expect.poll(() => section.evaluate(element => element.getBoundingClientRect().top)).toBeLessThan(before - 400);
    await expect(section).toHaveAttribute('data-active', '0');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
  });
}

test('reduced motion and swipes switch stages without a scroll sequence', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('.site-preloader')).toHaveCount(0);
  const section = page.locator('#engineering-path');
  await section.locator('.ke-composition').evaluate(surface => {
    surface.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, pointerType: 'touch', clientX: 300, clientY: 100 }));
    surface.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, pointerType: 'touch', clientX: 100, clientY: 105 }));
  });
  await expect(section).toHaveAttribute('data-active', '1');
  await expect(section.getByRole('heading', { name: 'Plan', exact: true })).toBeVisible();
  await expect(page.locator('.pin-spacer')).toHaveCount(0);
});

test('dragging outside the panel switches stages and tiles stay synchronized', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await expect(page.locator('.site-preloader')).toHaveCount(0);
  const section = page.locator('#engineering-path');
  await section.scrollIntoViewIfNeeded();
  const panel = await section.locator('.ke-composition').boundingBox();
  if (!panel) throw new Error('Engineering panel missing');
  const y = panel.y + panel.height / 2;
  await page.mouse.move(panel.x + 180, y);
  await page.mouse.down();
  await page.mouse.move(panel.x - 20, y, { steps: 8 });
  await page.mouse.up();
  await expect(section).toHaveAttribute('data-active', '1');
  await expect(section.getByRole('button', { name: 'Show Plan', exact: true })).toHaveAttribute('aria-pressed', 'true');
  expect(await page.evaluate(() => window.getSelection()?.toString())).toBe('');
  await section.getByRole('button', { name: 'Show Every connection', exact: true }).click();
  await expect(section.getByRole('button', { name: 'Next engineering stage', exact: true })).toBeDisabled();
  await section.getByRole('button', { name: 'Show Understand', exact: true }).click();
  await expect(section.getByRole('button', { name: 'Previous engineering stage', exact: true })).toBeDisabled();
});

test('native touch swipes navigate both ways while vertical gestures scroll the page', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const page = await context.newPage();
  await page.goto('/');
  await expect(page.locator('.site-preloader')).toHaveCount(0);
  await page.locator('.enquiry-popup').evaluate((dialog: HTMLDialogElement) => {
    new MutationObserver(() => { if (dialog.open) dialog.close(); }).observe(dialog, { attributes: true, attributeFilter: ['open'] });
    if (dialog.open) dialog.close();
  });
  const section = page.locator('#engineering-path');
  await section.scrollIntoViewIfNeeded();
  const panel = await section.locator('.ke-composition').boundingBox();
  if (!panel) throw new Error('Engineering panel missing');
  const session = await context.newCDPSession(page);
  const gesture = async (x: number, y: number, dx: number, dy: number) => {
    await session.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] });
    for (let step = 1; step <= 6; step++) {
      await session.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: x + dx * step / 6, y: y + dy * step / 6 }] });
    }
    await session.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  };
  const y = panel.y + panel.height / 2;
  await gesture(310, y, -210, 3);
  await expect(section).toHaveAttribute('data-active', '1');
  await gesture(100, y, 210, 3);
  await expect(section).toHaveAttribute('data-active', '0');
  const scrollBefore = await page.evaluate(() => scrollY);
  await gesture(200, y, 3, -100);
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(scrollBefore + 30);
  await expect(section).toHaveAttribute('data-active', '0');
  const finalTile = section.getByRole('button', { name: 'Show Every connection', exact: true });
  await finalTile.focus();
  await page.keyboard.press('Enter');
  await expect(finalTile).toHaveAttribute('aria-pressed', 'true');
  const tiles = await section.locator('.ke-stage-tiles').boundingBox();
  const tile = await finalTile.boundingBox();
  expect(tile!.x).toBeGreaterThanOrEqual(tiles!.x);
  expect(tile!.x + tile!.width).toBeLessThanOrEqual(tiles!.x + tiles!.width);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
  await context.close();
});

for (const width of [390, 1440]) {
  test('stage photographs match their thumbnails at ' + width + 'px', async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await expect(page.locator('.site-preloader')).toHaveCount(0);
    await page.locator('.enquiry-popup').evaluate((dialog: HTMLDialogElement) => {
      new MutationObserver(() => { if (dialog.open) dialog.close(); }).observe(dialog, { attributes: true, attributeFilter: ['open'] });
      if (dialog.open) dialog.close();
    });
    const section = page.locator('#engineering-path');
    const surface = section.locator('.ke-surface');
    const original = await surface.evaluate(element => getComputedStyle(element).backgroundImage);
    expect(original.replaceAll('%20', ' ')).toContain('Industrial Substation at Sunset.png');
    const buttons = section.locator('.ke-stage-tiles button');
    const images: string[] = [];
    for (let i = 0; i < 7; i++) {
      const button = buttons.nth(i);
      if (width === 1440) await button.hover();
      else await button.click();
      await expect(section).toHaveAttribute('data-active', String(i));
      await expect(button).toHaveAttribute('aria-pressed', 'true');
      const url = await button.evaluate(element => getComputedStyle(element).getPropertyValue('--step-thumbnail').trim());
      const image = url.slice(5, -2);
      images.push(image);
      expect(await surface.evaluate(element => getComputedStyle(element).backgroundImage)).toContain(image);
      expect(await page.evaluate(src => new Promise<boolean>(resolve => { const img = new Image(); img.onload = () => resolve(img.naturalWidth > 0); img.onerror = () => resolve(false); img.src = src; }), image)).toBeTruthy();
    }
    expect(new Set(images).size).toBe(7);
    await buttons.first().click();
    expect(await surface.evaluate(element => getComputedStyle(element).backgroundImage)).toBe(original);
  });
}
