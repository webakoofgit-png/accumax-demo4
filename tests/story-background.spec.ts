import { test, expect } from '@playwright/test';

for (const width of [390, 1440]) {
  test(`story photo covers the full section at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await expect(page.locator('.site-preloader')).toHaveCount(0);
    const story = page.locator('.story--carousel');
    await story.scrollIntoViewIfNeeded();
    const section = (await story.boundingBox())!;
    const photo = (await story.locator('.story-photo').boundingBox())!;
    expect(photo.x).toBeCloseTo(section.x, 1);
    expect(photo.width).toBeCloseTo(section.width, 1);
    expect(photo.height).toBeCloseTo(section.height, 1);
    await expect(story.locator('.story-photo')).toHaveCSS('opacity', '1');
    const overlay = await story.evaluate(element => getComputedStyle(element, '::after').backgroundImage);
    expect(overlay).toContain('linear-gradient(90deg');
    await expect(story.getByRole('heading', { name: 'Engineering', exact: true })).toBeVisible();
  });
}
