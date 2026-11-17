import { test, expect } from '@playwright/test';

for (const width of [320, 390, 640]) {
  test(`mobile outline logo shares the button row at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await expect(page.locator('.site-preloader')).toHaveCount(0);
    const section = page.locator('.about-block');
    await section.locator('.about-story-button').scrollIntoViewIfNeeded();
    const button = (await section.locator('.about-story-button').boundingBox())!;
    const logo = (await section.locator('.about-brand-watermark').boundingBox())!;
    const bounds = (await section.boundingBox())!;
    expect(logo.x).toBeGreaterThan(button.x + button.width + 8);
    expect(logo.y + logo.height).toBeLessThanOrEqual(button.y + button.height + 12);
    expect(bounds.y + bounds.height - button.y - button.height).toBeLessThanOrEqual(40);
    expect(logo.y + logo.height).toBeLessThan(bounds.y + bounds.height);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
  });
}
