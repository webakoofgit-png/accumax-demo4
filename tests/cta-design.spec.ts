import { test, expect } from '@playwright/test';

for (const width of [390, 1440]) {
  test(`industrial wave CTA at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await expect(page.locator('.site-preloader')).toHaveCount(0);
    const cta = page.locator('.contact-band');
    await cta.scrollIntoViewIfNeeded();
    await expect(cta.getByRole('heading')).toHaveText('Have an engineering challenge?');
    const background = await cta.evaluate(element => getComputedStyle(element).backgroundImage);
    expect(background).toContain('svg');
    expect(background).not.toContain('cta-diamonds');
    await expect(cta.getByRole('link', { name: 'Enquire on WhatsApp' })).toHaveAttribute('href', 'https://wa.link/yypj14');
    expect(await cta.evaluate(element => element.scrollWidth <= element.clientWidth)).toBeTruthy();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
    await cta.screenshot({ path: `test-results/cta-${width}.png` });
  });
}

test('CTA appears only on Home, About and Projects, including client-side navigation', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('.site-preloader')).toHaveCount(0);
  for (const [route, visible] of [['/services', false], ['/about', true], ['/contact', false], ['/projects', true], ['/industries', false], ['/', true]] as const) {
    const link = page.locator('footer').locator(`a[href="${route}"]`).first();
    await link.click();
    await expect(page).toHaveURL(new RegExp(`${route === '/' ? '/$' : route + '$'}`));
    await expect(page.locator('.contact-band')).toHaveCount(visible ? 1 : 0);
  }
});
