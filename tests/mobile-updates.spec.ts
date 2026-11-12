import { test, expect } from '@playwright/test';

for (const width of [320, 390, 768]) {
  test(`current sections remain readable and interactive at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.addInitScript(() => sessionStorage.setItem('accumax-enquiry-seen', '1'));
    await page.goto('/');
    await expect(page.locator('.site-preloader')).toHaveCount(0);
    const dialog = page.locator('dialog.enquiry-popup');
    if (await dialog.isVisible()) await dialog.getByRole('button', { name: 'Close enquiry form' }).click();

    const process = page.locator('#project-management-process');
    await process.scrollIntoViewIfNeeded();
    await process.getByRole('button', { name: /Execution/ }).click();
    await expect(process.getByRole('button', { name: /Execution/ })).toHaveAttribute('aria-pressed', 'true');
    await expect(process.locator('.process-detail.is-active')).toHaveCount(2);
    const copySizes = await process.locator('.process-detail p').evaluateAll(elements =>
      elements.map(element => parseFloat(getComputedStyle(element).fontSize)));
    expect(Math.min(...copySizes)).toBeGreaterThanOrEqual(width <= 640 ? 4.5 : 13);
    if (width <= 640) {
      expect(await process.evaluate(element => element.getBoundingClientRect().height))
        .toBeLessThanOrEqual(844 - 64);
      await expect(process.locator('.process-detail')).toHaveCount(6);
      const rows = await process.locator('.process-detail').evaluateAll(elements =>
        elements.map(element => Math.round(element.getBoundingClientRect().top)));
      expect(new Set(rows).size).toBe(1);
      await process.screenshot({ path: `test-results/mobile-process-${width}.png` });
    }

    const engineering = page.locator('#engineering-path');
    for (const stage of ['Understand', 'Plan', 'Engineer', 'Execute', 'Test', 'Deliver', 'Every connection']) {
      await engineering.getByRole('button', { name: `Show ${stage}`, exact: true }).click();
      await expect(engineering.getByRole('button', { name: `Show ${stage}`, exact: true })).toHaveAttribute('aria-pressed', 'true');
      const visibleScene = engineering.locator('.ke-scene[aria-hidden="false"]');
      expect(await visibleScene.evaluate(element => {
        const scene = element.getBoundingClientRect();
        return [...element.querySelectorAll('h3,p')].every(child => {
          const box = child.getBoundingClientRect();
          return box.top >= scene.top - 2 && box.bottom <= scene.bottom + 2
            && child.scrollWidth <= child.clientWidth + 2;
        });
      })).toBeTruthy();
    }

    await page.getByRole('button', { name: 'Open navigation' }).click();
    await page.getByRole('dialog', { name: 'Navigation' }).getByRole('link', { name: /Get in Touch/ }).click();
    await expect(page).toHaveURL(/\/contact$/);
    await page.locator('.contact-layout').getByLabel('Full name').fill('Mobile review');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBeTruthy();
    await page.goto('/');
    await expect(page.locator('.site-preloader')).toHaveCount(0);
    await page.screenshot({ path: `test-results/mobile-updates-${width}.png`, fullPage: true });
  });
}
