import { test, expect } from '@playwright/test';

for (const width of [390, 1440]) {
  test(`engineering stages are optional and never hold page scrolling at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    await expect(page.locator('.site-preloader')).toHaveCount(0);
    await page.locator('.enquiry-popup').evaluate((dialog: HTMLDialogElement) => {
      new MutationObserver(() => { if (dialog.open) dialog.close(); }).observe(dialog, { attributes: true, attributeFilter: ['open'] });
      if (dialog.open) dialog.close();
    });
    const section = page.locator('#engineering-path');
    await expect(page.locator('.pin-spacer:has(#engineering-path)')).toHaveCount(0);
    await expect(section).toHaveAttribute('data-active', '0');
    await expect(page.getByRole('button', { name: /^(Previous|Next) engineering stage$/ })).toHaveCount(2);
    await expect(page.getByRole('button', { name: /^(Pause|Play) engineering stages$/ })).toHaveCount(0);
    await page.getByRole('button', { name: 'Next engineering stage', exact: true }).click();
    await expect(section).toHaveAttribute('data-active', '1');
    await page.getByRole('button', { name: 'Previous engineering stage', exact: true }).click();
    await expect(section).toHaveAttribute('data-active', '0');
    await page.getByRole('button', { name: 'Show Plan', exact: true }).click();
    await expect(section).toHaveAttribute('data-active', '1');
    await expect(section.getByRole('heading', { name: 'Plan', exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'Show Deliver', exact: true }).focus();
    await page.keyboard.press('Enter');
    await expect(section).toHaveAttribute('data-active', '5');
    await page.getByRole('button', { name: 'Show Every connection', exact: true }).click();
    await expect(section).toHaveAttribute('data-active', '6');
    await expect(section.locator('.ke-finale')).toBeVisible();
    await page.getByRole('button', { name: 'Show Understand', exact: true }).click();
    await section.evaluate(element => window.scrollTo({ top: scrollY + element.getBoundingClientRect().top - 90, behavior: 'instant' }));
    const before = await section.evaluate(element => element.getBoundingClientRect().top);
    await page.mouse.move(width - 20, 300);
    await page.mouse.wheel(0, 600);
    await expect.poll(() => section.evaluate(element => element.getBoundingClientRect().top)).toBeLessThan(before - 400);
    await expect(section).toHaveAttribute('data-active', '0');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
  });
}

test('reduced motion and swipes switch stages without a scroll sequence', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('.site-preloader')).toHaveCount(0);
  const section = page.locator('#engineering-path');
  await section.locator('.ke-composition').evaluate(surface => {
    surface.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, pointerType: 'touch', clientX: 300, clientY: 100 }));
    surface.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, pointerType: 'touch', clientX: 100, clientY: 105 }));
  });
  await expect(section).toHaveAttribute('data-active', '1');
  await expect(section.getByRole('heading', { name: 'Plan', exact: true })).toBeVisible();
  await expect(page.locator('.pin-spacer')).toHaveCount(0);
});
