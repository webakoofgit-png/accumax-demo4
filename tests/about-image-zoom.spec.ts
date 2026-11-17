import { test, expect } from '@playwright/test';

for (const [route, selector] of [['/', '.about-photo'], ['/about', '.about-editorial-image']]) {
  test(`substation image zooms out on hover at ${route}`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto(route);
    await expect(page.locator('.site-preloader')).toHaveCount(0);
    const frame = page.locator(selector);
    const image = frame.locator('img');
    await page.mouse.move(0, 0);
    await frame.scrollIntoViewIfNeeded();
    await expect(image).toHaveCSS('scale', '1.08');
    const before = (await frame.boundingBox())!;
    await frame.hover();
    await expect(image).toHaveCSS('scale', '1');
    const after = (await frame.boundingBox())!;
    expect(after.width).toBeCloseTo(before.width, 1);
    await page.mouse.move(0, 0);
    await expect(image).toHaveCSS('scale', '1.08');
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await frame.hover();
    await expect(image).toHaveCSS('scale', 'none');
  });
}
