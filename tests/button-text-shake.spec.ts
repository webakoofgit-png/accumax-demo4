import { test, expect } from '@playwright/test';

test('button labels shake while the button stays still and reduced motion is respected', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await expect(page.locator('.site-preloader')).toHaveCount(0);
  const button = page.getByRole('link', { name: 'Explore expertise', exact: true });
  await expect(button).toHaveCSS('opacity', '1');
  const label = button.locator('.button-label');
  await expect(label).toHaveCount(1);
  const before = (await button.boundingBox())!;
  await button.hover();
  await expect(label).toHaveCSS('animation-name', 'button-text-shake');
  const after = (await button.boundingBox())!;
  expect(after.x).toBeCloseTo(before.x, 1);
  expect(after.y).toBeCloseTo(before.y, 1);
  expect(after.width).toBeCloseTo(before.width, 1);
  expect(after.height).toBeCloseTo(before.height, 1);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(label).toHaveCSS('animation-name', 'none');
  await button.click();
  await expect(page).toHaveURL(/\/services$/);
});
