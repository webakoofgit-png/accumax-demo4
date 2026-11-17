import { test, expect } from '@playwright/test';

for (const width of [320, 390, 640, 1440]) {
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
    if (width <= 640) {
      const grid = (await footer.locator('.footer-grid').boundingBox())!;
      const contact = (await footer.locator('.footer-contact-column').boundingBox())!;
      expect(contact.width).toBeCloseTo(grid.width, 1);
      const resources = await footer.locator('.footer-resources-column > a').evaluateAll(links => links.map(link => link.getBoundingClientRect().x));
      expect(new Set(resources.map(x => Math.round(x))).size).toBe(1);
      const columns = footer.locator('.footer-grid > div');
      for (let index = 0; index < 4; index++) {
        const column = (await columns.nth(index).boundingBox())!;
        expect(column.x).toBeCloseTo(grid.x, 1);
        expect(column.width).toBeCloseTo(grid.width, 1);
        if (index > 0) {
          const previous = (await columns.nth(index - 1).boundingBox())!;
          expect(column.y).toBeGreaterThan(previous.y + previous.height);
        }
      }
      const brand = (await footer.locator('.footer-brand').boundingBox())!;
      expect(brand.x + brand.width).toBeLessThanOrEqual(width - 80);
      const email = footer.locator('.footer-contact-detail a[href^="mailto:"]');
      const phone = footer.locator('.footer-contact-detail a[href^="tel:"]');
      for (const link of [email, phone]) {
        const singleLine = await link.evaluate(element => {
          const range = document.createRange();
          range.selectNodeContents(element);
          return range.getClientRects().length === 1;
        });
        expect(singleLine).toBeTruthy();
      }
    }
    expect(await footer.locator('.footer-brand img').evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBeTruthy();
    expect(await footer.evaluate(element => element.scrollWidth <= element.clientWidth)).toBeTruthy();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
    const cells = await footer.locator('.footer-grid > div').evaluateAll(elements => elements.map(element => ({ x: element.getBoundingClientRect().x, y: element.getBoundingClientRect().y })));
    if (width > 1100) expect(new Set(cells.map(cell => Math.round(cell.y))).size).toBe(1);
    await page.screenshot({ path: `test-results/footer-${width}.png`, fullPage: false });
    await expect(footer.getByRole('navigation', { name: 'Footer quick links' })).toHaveCount(0);
  });
}
