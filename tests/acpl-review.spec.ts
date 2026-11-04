import { test, expect } from '@playwright/test';

for (const width of [390, 1200, 1440]) {
  test(`review interactions and normal scrolling at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto('/');
    await expect(page.locator('.site-preloader')).toHaveCount(0);
    await page.locator('.enquiry-popup').evaluate((dialog: HTMLDialogElement) => {
      new MutationObserver(() => { if (dialog.open) dialog.close(); }).observe(dialog, { attributes: true, attributeFilter: ['open'] });
      if (dialog.open) dialog.close();
    });
    await expect(page.getByRole('heading', { level: 1, name: 'Expedite Efficiency with Excellence', exact: true })).toBeVisible();
    await expect(page.locator('.opening-video')).toBeAttached();
    await page.getByRole('button', { name: 'Pause opening film' }).click();
    await expect(page.locator('.opening-video')).toHaveJSProperty('paused', true);
    await expect(page.locator('#expertise .pin-spacer')).toHaveCount(0);
    await expect(page.locator('.story .story-panel')).toHaveCount(4);
    await expect(page.locator('.story')).toHaveClass(/story--animated/);
    await expect(page.locator('.story')).toHaveCSS('background-color', 'rgb(34, 41, 31)');
    await expect(page.locator('.pin-spacer')).toHaveCount(0);
    const firstApproach = await page.locator('.story-photo img').getAttribute('src');
    await page.getByRole('button', { name: 'Next approach', exact: true }).click();
    await expect(page.locator('.story')).toHaveAttribute('data-active', '1');
    await expect(page.locator('.story-photo img')).not.toHaveAttribute('src', firstApproach!);
    await expect(page.locator('#engineering-path')).toHaveClass('kinetic-engineering');
    await expect(page.locator('#engineering-path .ke-process')).toHaveCount(6);
    await expect(page.locator('.projects-section [class*=watermark], .projects-section img[src*=logo]')).toHaveCount(0);
    await expect(page.locator('footer iframe')).toHaveAttribute('src', /maps\.google\.com/);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
    expect(await page.locator('.header').evaluate(header => {
      const children = [...header.querySelectorAll('.primary-nav>a,.header-socials a')].filter(item => item.getBoundingClientRect().width);
      return children.every(item => { const bounds = item.getBoundingClientRect(); return bounds.left >= 0 && bounds.right <= innerWidth; });
    })).toBeTruthy();
    await page.locator('.story').scrollIntoViewIfNeeded();
    await page.screenshot({ path: `test-results/acpl-review-${width}.png` });
    expect(errors).toEqual([]);
  });
}

test('reduced motion keeps the opening static and engineering stages readable', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('.site-preloader')).toHaveCount(0);
  await expect(page.locator('.opening-video')).toHaveJSProperty('paused', true);
  await expect(page.locator('.opening-video')).not.toHaveAttribute('src');
  await expect(page.locator('#engineering-path .ke-process')).toHaveCount(6);
  await expect(page.locator('#engineering-path')).toHaveAttribute('data-enhanced', 'true');
  await expect(page.locator('#engineering-path .ke-process').first()).toBeVisible();
  await page.getByRole('button', { name: 'Show Deliver', exact: true }).click();
  await expect(page.locator('#engineering-path .ke-process').last()).toBeVisible();
});
