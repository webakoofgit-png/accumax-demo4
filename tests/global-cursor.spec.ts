import { test, expect, type Page } from '@playwright/test';

async function open(page: Page, route = '/about', allowPopup = false) {
  await page.goto(route);
  await expect(page.locator('.ac-comet-cursor')).toBeAttached();
  await expect(page.locator('.site-preloader')).toHaveCount(0);
  if (!allowPopup) await page.locator('.enquiry-popup').evaluate((dialog: HTMLDialogElement) => {
    const observer = new MutationObserver(() => { if (dialog.open) dialog.close(); });
    observer.observe(dialog, { attributes: true, attributeFilter: ['open'] });
    if (dialog.open) dialog.close();
  });
}

test('comet has six particles, an immediate pointer and a fully idle trail', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await open(page);
  const cursor = page.locator('.ac-comet-cursor');
  await expect(page.locator('html')).not.toHaveAttribute('data-accumax-cursor');
  await page.mouse.move(30, 170);
  await expect(cursor).toHaveAttribute('data-visible', 'true');
  await expect(cursor).toHaveAttribute('data-mode', 'default');
  await expect(cursor.locator('.ac-comet-core')).toHaveCSS('width', '10px');
  await expect(cursor.locator('.ac-comet-particle')).toHaveCount(6);
  await expect(cursor.locator('.ac-cursor-outline')).toHaveCount(0);
  const sizes = await cursor.locator('.ac-comet-particle').evaluateAll(elements => elements.map(element => parseFloat(getComputedStyle(element).width)));
  expect(sizes).toEqual([4, 3.5, 3, 2.5, 2, 1.5]);
  // Synchronous inspection proves the leading pointer never waits for the trail's RAF.
  const movement = await page.evaluate(() => {
    const target = document.elementFromPoint(550, 180)!;
    target.dispatchEvent(new PointerEvent('pointermove', { bubbles: true, pointerType: 'mouse', clientX: 550, clientY: 180 }));
    return {
      head: new DOMMatrix(getComputedStyle(document.querySelector('.ac-comet-head')!).transform).m41,
      tail: new DOMMatrix(getComputedStyle(document.querySelector('.ac-comet-particle')!).transform).m41,
    };
  });
  expect(movement.head).toBe(550);
  expect(movement.tail).toBeLessThan(550);
  await expect(cursor).toHaveAttribute('data-motion', 'idle');
  await expect(cursor.locator('.ac-comet-trail')).toHaveCSS('opacity', '0');
  await expect(cursor).toHaveAttribute('data-visible', 'true');
  await page.mouse.move(580, 180);
  await expect(cursor).toHaveAttribute('data-motion', 'moving');
  await page.keyboard.press('Tab');
  await expect(cursor).toHaveAttribute('data-visible', 'false');
  await expect(page.locator('html')).not.toHaveAttribute('data-accumax-cursor');
  expect(errors).toEqual([]);
});

test('navigation stays precise, buttons outline, links point and clickable photos show VIEW', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await open(page);
  const cursor = page.locator('.ac-comet-cursor');
  await page.locator('.header a[href="/services"]').hover();
  await expect(cursor).toHaveAttribute('data-mode', 'nav');
  await expect(cursor.locator('.ac-comet-core')).toHaveCSS('width', '10px');
  await page.locator('.header a[href="/services"]').click();
  await expect(page).toHaveURL(/\/services$/);
  await expect(page.locator('main[data-route="/services"]')).toHaveCSS('opacity', '1');
  await page.locator('.contact-band .button').hover();
  await expect(cursor).toHaveAttribute('data-mode', 'button');
  await expect(cursor.locator('.ac-comet-core')).toHaveCSS('width', '28px');
  await page.locator('.contact-band>a').hover();
  await expect(cursor).toHaveAttribute('data-mode', 'link');
  await expect(cursor.locator('.ac-comet-arrow')).toHaveCSS('opacity', '1');
  await expect(cursor).toHaveAttribute('data-tone', 'dark');
  await expect(cursor).toHaveCSS('color', 'rgb(243, 154, 99)');
  await open(page, '/gallery');
  const image = page.locator('.gallery-grid button img').first();
  await image.hover();
  await expect(cursor).toHaveAttribute('data-mode', 'view');
  await expect(cursor.locator('.ac-comet-view')).toHaveCSS('opacity', '1');
  await expect(cursor.locator('.ac-comet-core')).toHaveCSS('width', '14px');
  await expect(cursor).toHaveCSS('pointer-events', 'none');
  await image.click();
  await expect(page.locator('.lightbox')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('.lightbox')).toHaveCount(0);
});

test('native editing, modal top layers and one 280ms ripple remain functional', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await open(page, '/contact', true);
  const cursor = page.locator('.ac-comet-cursor');
  const popup = page.locator('.enquiry-popup');
  await popup.evaluate((dialog: HTMLDialogElement) => { if (!dialog.open) dialog.showModal(); });
  const name = popup.getByLabel('Full name');
  await name.hover();
  await expect(cursor).toHaveAttribute('data-visible', 'false');
  await expect(page.locator('html')).not.toHaveAttribute('data-accumax-cursor');
  expect(await name.evaluate(element => getComputedStyle(element).cursor)).not.toBe('none');
  await name.fill('Cursor accessibility check');
  const close = popup.getByRole('button', { name: 'Close enquiry form' });
  await close.hover();
  await expect(cursor).toHaveAttribute('data-mode', 'button');
  expect(await cursor.evaluate(element => element.matches(':popover-open'))).toBeTruthy();
  await page.mouse.down();
  expect(await cursor.locator('.ac-comet-ripple-shape').evaluate(element => element.getAnimations()[0]?.effect?.getTiming().duration)).toBe(280);
  await page.mouse.up();
  await expect(popup).not.toBeVisible();
  await page.keyboard.press('Tab');
  await expect(cursor).toHaveAttribute('data-visible', 'false');
});

test('reduced motion disables the cursor and cancels an active trail', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await open(page);
  await page.mouse.move(30, 170);
  const cursor = page.locator('.ac-comet-cursor');
  await expect(cursor).toHaveCSS('display', 'none');
  await expect(page.locator('html')).not.toHaveAttribute('data-accumax-cursor');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await expect(cursor).toHaveAttribute('popover', 'manual');
  await page.mouse.move(40, 180);
  await expect(cursor).toHaveAttribute('data-visible', 'true');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(cursor).toHaveAttribute('data-visible', 'false');
  await expect(cursor).toHaveAttribute('data-motion', 'idle');
  await expect(page.locator('html')).not.toHaveAttribute('data-accumax-cursor');
});

test('touch devices retain native navigation without cursor effects', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  try {
    const page = await context.newPage();
    await page.goto('http://127.0.0.1:4174/');
    await expect(page.locator('.site-preloader')).toHaveCount(0);
    await expect(page.locator('.ac-comet-cursor')).toHaveCSS('display', 'none');
    await page.getByRole('button', { name: 'Open navigation' }).tap();
    await expect(page.locator('.mobile-menu')).toBeVisible();
    await expect(page.locator('html')).not.toHaveAttribute('data-accumax-cursor');
  } finally { await context.close(); }
});
