import { test, expect } from '@playwright/test';

for (const width of [320, 390, 640, 1440]) {
  test(`process arrows remain centered and proportional at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await expect(page.locator('.site-preloader')).toHaveCount(0);
    const chart = page.locator('#project-management-process');
    await chart.scrollIntoViewIfNeeded();
    const buttons = chart.locator('.process-stages > button');
    await expect(buttons).toHaveCount(5);
    for (let index = 0; index < 4; index++) {
      const button = (await buttons.nth(index).boundingBox())!;
      const next = (await buttons.nth(index + 1).boundingBox())!;
      const arrow = (await buttons.nth(index).locator('.process-stage-arrow').boundingBox())!;
      expect(Math.abs(arrow.y + arrow.height / 2 - button.y - button.height / 2)).toBeLessThan(1);
      expect(Math.abs(arrow.width - (next.x - button.x - button.width))).toBeLessThan(1);
      expect(arrow.x).toBeGreaterThanOrEqual(button.x + button.width - 1);
      expect(arrow.x + arrow.width).toBeLessThanOrEqual(next.x + 2);
      expect(arrow.height).toBeLessThanOrEqual(button.height);
    }
    await expect(chart.locator('.process-connections > path')).toHaveCount(6);
    await expect(chart.locator('marker').first()).toHaveAttribute('markerWidth', width <= 760 ? '10' : '20');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
    if (width === 390) await chart.screenshot({ path: 'test-results/process-mobile-arrows.png' });
  });
}
