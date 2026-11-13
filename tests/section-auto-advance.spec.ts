import { test, expect } from '@playwright/test';

for (const width of [390, 1440]) {
  test(`home carousels advance every ten seconds at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('.site-preloader')).toHaveCount(0);
    await page.locator('.enquiry-popup').evaluate((dialog: HTMLDialogElement) => {
      new MutationObserver(() => { if (dialog.open) dialog.close(); }).observe(dialog, { attributes: true, attributeFilter: ['open'] });
      if (dialog.open) dialog.close();
    });

    await page.clock.install();
    for (const [selector, count, next] of [
      ['.story', 4, 'Next approach'],
      ['#engineering-path', 7, 'Next engineering stage'],
    ] as const) {
      const section = page.locator(selector);
      await section.evaluate(element => element.scrollIntoView({ block: 'center', behavior: 'instant' }));
      await page.waitForTimeout(300);
      const initial = Number(await section.getAttribute('data-active'));
      await page.clock.runFor(9_000);
      await expect(section).toHaveAttribute('data-active', String(initial));
      await page.clock.runFor(1_100);
      await expect(section).toHaveAttribute('data-active', String((initial + 1) % count));

      // Manual selection starts a fresh reading interval.
      await page.clock.runFor(5_000);
      await section.getByRole('button', { name: next, exact: true }).evaluate((button: HTMLButtonElement) => button.click());
      const selected = Number(await section.getAttribute('data-active'));
      await page.clock.runFor(9_000);
      await expect(section).toHaveAttribute('data-active', String(selected));
      await page.clock.runFor(1_100);
      await expect(section).toHaveAttribute('data-active', String((selected + 1) % count));

      // Keyboard focus prevents an unexpected slide change.
      await section.locator('button:not(:disabled)').first().focus();
      const focused = await section.getAttribute('data-active');
      await page.clock.runFor(10_100);
      await expect(section).toHaveAttribute('data-active', focused!);
      await page.evaluate(() => (document.activeElement as HTMLElement)?.blur());
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.clock.runFor(20_100);
      await expect(section).toHaveAttribute('data-active', focused!);
      await page.emulateMedia({ reducedMotion: 'no-preference' });
    }
  });
}
