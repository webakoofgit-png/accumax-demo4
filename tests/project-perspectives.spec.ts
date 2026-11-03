import { test, expect } from '@playwright/test';

for (const width of [390, 1440]) {
  test(`service cards at ${width}px reveal copy on hover or focus and preserve navigation`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto('/');
    const cards = page.locator('.perspective-service-card');
    await expect(cards).toHaveCount(8);
    await expect(page.locator('.site-preloader')).toHaveCount(0);
    await page.locator('.enquiry-popup').evaluate((dialog: HTMLDialogElement) => {
      new MutationObserver(() => { if (dialog.open) dialog.close(); }).observe(dialog, { attributes: true, attributeFilter: ['open'] });
      if (dialog.open) dialog.close();
    });
    await cards.first().scrollIntoViewIfNeeded();
    await expect(cards.first().locator('.perspective-service-body')).toHaveCSS('opacity', '0');
    await cards.first().focus();
    await expect(cards.first().locator('.perspective-service-body')).toHaveCSS('opacity', '1');
    await cards.first().hover();
    expect(await cards.first().evaluate(element => getComputedStyle(element, ':after').backgroundImage)).toContain('linear-gradient');
    await expect(cards.first().locator('h3')).toHaveText('EPC Projects');
    await expect(cards.first().locator('h3')).toHaveCSS('opacity', '1');
    await expect(cards.first().locator('p')).toHaveCSS('opacity', '1');
    await expect(cards.first()).toHaveAttribute('href', '/services/epc-projects');
    await expect.poll(() => cards.first().locator('.perspective-service-media img').evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBeTruthy();
    await expect(cards.first()).toHaveCSS('position', 'relative');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
    await page.screenshot({ path: `test-results/project-perspectives-${width}.png` });
    await cards.first().click();
    await expect(page).toHaveURL(/\/services\/epc-projects$/);
    expect(errors).toEqual([]);
  });
}

test.describe('touch card overlay', () => {
  test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  test('first tap reveals red overlay, outside tap dismisses, second tap opens service', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.site-preloader')).toHaveCount(0);
    await page.locator('.enquiry-popup').evaluate((dialog: HTMLDialogElement) => {
      new MutationObserver(() => { if (dialog.open) dialog.close(); }).observe(dialog, { attributes: true, attributeFilter: ['open'] });
      if (dialog.open) dialog.close();
    });
    const cards = page.locator('.perspective-service-card');
    const first = cards.first();
    await first.scrollIntoViewIfNeeded();
    await expect(first.locator('.perspective-touch-hint')).toBeVisible();
    await expect(first.locator('.perspective-service-body')).toHaveCSS('opacity', '0');
    await expect.poll(() => first.evaluate(element => getComputedStyle(element, ':after').opacity)).toBe('0');
    await first.tap();
    await expect(first.locator('.perspective-touch-hint')).toHaveCSS('opacity', '0');
    await expect(page).toHaveURL(/\/$/);
    await expect(first.locator('.perspective-service-body')).toHaveCSS('opacity', '1');
    await expect.poll(() => first.evaluate(element => getComputedStyle(element, ':after').opacity)).toBe('1');
    await page.locator('.projects-section h2').tap();
    await expect(first.locator('.perspective-service-body')).toHaveCSS('opacity', '0');
    await cards.nth(1).tap();
    await expect(cards.nth(1).locator('.perspective-service-body')).toHaveCSS('opacity', '1');
    await expect(first.locator('.perspective-service-body')).toHaveCSS('opacity', '0');
    await cards.nth(1).tap();
    await expect(page).toHaveURL(/\/services\/scada-relay-testing$/);
  });
});
