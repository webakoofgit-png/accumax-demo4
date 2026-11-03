import { test, expect } from '@playwright/test';

for (const width of [390, 1440]) {
  test(`editorial expertise cards at ${width}px show captions and browse horizontally`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto('/');
    await expect(page.locator('.perspective-service-card')).toHaveCount(8, { timeout: 20000 });
    await expect(page.locator('.site-preloader')).toHaveCount(0);
    await page.locator('.enquiry-popup').evaluate((dialog: HTMLDialogElement) => {
      new MutationObserver(() => { if (dialog.open) dialog.close(); }).observe(dialog, { attributes: true, attributeFilter: ['open'] });
      if (dialog.open) dialog.close();
    });
    const cards = page.locator('.perspective-service-card');
    await expect(cards).toHaveCount(8);
    await cards.first().scrollIntoViewIfNeeded();
    await expect(cards.first().locator('h3')).toHaveText('EPC Projects');
    await expect(cards.first().locator('.perspective-service-body')).toHaveCSS('opacity', '1');
    await expect(cards.first().locator('.perspective-image-overlay')).toHaveCSS('opacity', '0');
    await cards.first().hover();
    await expect(cards.first().locator('.perspective-image-overlay')).toHaveCSS('opacity', '1');
    await expect(cards.first().locator('.perspective-overlay-copy strong')).toHaveText('EPC Projects');
    await expect(cards.first().locator('.perspective-service-body p')).toHaveText('Power infrastructure, end to end.');
    expect(await cards.first().evaluate(card => {
      const image = card.querySelector('.perspective-service-media')!.getBoundingClientRect();
      const body = card.querySelector('.perspective-service-body')!.getBoundingClientRect();
      return body.top >= image.bottom - 1;
    })).toBeTruthy();
    const track = page.getByRole('region', { name: 'Engineering expertise cards' });
    await expect(page.getByRole('button', { name: 'Previous expertise cards' })).toBeDisabled();
    await page.getByRole('button', { name: 'Next expertise cards' }).click();
    await expect.poll(() => track.evaluate(element => element.scrollLeft)).toBeGreaterThan(100);
    await expect(page.getByRole('button', { name: 'Previous expertise cards' })).toBeEnabled();
    await page.getByRole('button', { name: 'Previous expertise cards' }).click();
    await expect.poll(() => track.evaluate(element => element.scrollLeft)).toBeLessThan(2);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
    await page.screenshot({ path: `test-results/project-perspectives-${width}.png` });
    await cards.first().click();
    await expect(page).toHaveURL(/\/services\/epc-projects$/);
    expect(errors).toEqual([]);
  });
}

test.describe('touch cards', () => {
  test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  test('caption stays visible and a single tap opens the service', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.perspective-service-card')).toHaveCount(8, { timeout: 20000 });
    await expect(page.locator('.site-preloader')).toHaveCount(0);
    await page.locator('.enquiry-popup').evaluate((dialog: HTMLDialogElement) => {
      new MutationObserver(() => { if (dialog.open) dialog.close(); }).observe(dialog, { attributes: true, attributeFilter: ['open'] });
      if (dialog.open) dialog.close();
    });
    const card = page.locator('.perspective-service-card').first();
    await card.scrollIntoViewIfNeeded();
    await expect(card.locator('.perspective-service-body')).toHaveCSS('opacity', '1');
    await card.tap();
    await expect(page).toHaveURL(/\/services\/epc-projects$/);
  });
});

test('cards auto advance, pause for hover, loop and respect reduced motion', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  const track = page.getByRole('region', { name: 'Engineering expertise cards' });
  await expect(track).toBeAttached({ timeout: 20000 });
  await expect(page.locator('.site-preloader')).toHaveCount(0);
  await page.locator('.enquiry-popup').evaluate((dialog: HTMLDialogElement) => {
    new MutationObserver(() => { if (dialog.open) dialog.close(); }).observe(dialog, { attributes: true, attributeFilter: ['open'] });
    if (dialog.open) dialog.close();
  });
  await track.scrollIntoViewIfNeeded();
  await page.mouse.move(0, 0);
  await expect(page.locator('.perspective-service-footer')).toHaveCount(0);
  await expect.poll(() => track.evaluate(element => element.scrollLeft), { timeout: 8000 }).toBeGreaterThan(100);
  await track.hover();
  await page.waitForTimeout(800);
  const held = await track.evaluate(element => element.scrollLeft);
  await page.waitForTimeout(4000);
  expect(await track.evaluate(element => element.scrollLeft)).toBeCloseTo(held, 0);
  await track.evaluate(element => element.scrollTo({ left: element.scrollWidth, behavior: 'instant' }));
  await page.mouse.move(0, 0);
  await expect.poll(() => track.evaluate(element => element.scrollLeft), { timeout: 8000 }).toBeLessThan(2);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.waitForTimeout(4000);
  expect(await track.evaluate(element => element.scrollLeft)).toBeLessThan(2);
});
