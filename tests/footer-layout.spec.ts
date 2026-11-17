import { test, expect } from '@playwright/test';

for (const width of [390, 1440]) {
  test(`footer layout stays readable at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await expect(page.locator('.site-preloader')).toHaveCount(0);
    const footer = page.locator('footer.site-footer');
    await footer.scrollIntoViewIfNeeded();
    await expect(footer).toHaveCSS('background-color', 'rgb(48, 45, 41)');
    await expect(footer.locator('.footer-grid > div')).toHaveCount(4);
    await expect(footer.getByRole('navigation', { name: 'Footer social media' }).getByRole('link')).toHaveCount(3);
    await expect(footer.locator('.footer-brand img')).toBeVisible();
    await expect(footer.locator('iframe')).toHaveCount(0);
    await expect(footer.locator('.footer-address')).toHaveAttribute('href', /https:\/\/www.google.com\/maps\/search/);
    await expect(footer.locator('.footer-address')).toHaveAttribute('target', '_blank');
    await expect(footer.getByText('View on Google Maps', { exact: true })).toHaveCount(0);
    expect(await footer.locator('.footer-brand img').evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBeTruthy();
    expect(await footer.evaluate(element => element.scrollWidth <= element.clientWidth)).toBeTruthy();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
    const cells = await footer.locator('.footer-grid > div').evaluateAll(elements => elements.map(element => ({ x: element.getBoundingClientRect().x, y: element.getBoundingClientRect().y })));
    if (width > 1100) expect(new Set(cells.map(cell => Math.round(cell.y))).size).toBe(1);
    await page.screenshot({ path: `test-results/footer-${width}.png`, fullPage: false });
    await expect(footer.getByRole('navigation', { name: 'Footer quick links' })).toHaveCount(0);
  });
}
