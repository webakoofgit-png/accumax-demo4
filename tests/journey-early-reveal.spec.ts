import { test, expect } from '@playwright/test';

test('journey steps reveal at the viewport edge without waiting for route progress', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await expect(page.locator('.site-preloader')).toHaveCount(0);
  const row = page.locator('.milestone-2');
  await row.evaluate(element => window.scrollTo({ top: scrollY + element.getBoundingClientRect().top - innerHeight * .9, behavior: 'instant' }));
  await expect(row.locator('.journey-image-mask')).toHaveCSS('clip-path', 'inset(0px)', { timeout: 2000 });
  await expect(row.locator('.journey-primary')).toHaveCSS('opacity', '1');
});
