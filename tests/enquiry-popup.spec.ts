import { test, expect } from '@playwright/test';

for (const width of [390, 1440]) {
  test(`enquiry opens after 10 seconds and closes accessibly at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto('/');
    const popup = page.getByRole('dialog', { name: /Project enquiry/ });
    await expect(popup).not.toBeVisible();
    await expect(popup).toBeVisible({ timeout: 15000 });
    const projectPhoto = popup.locator('.enquiry-popup-visual > img');
    await expect(projectPhoto).toBeVisible();
    await expect.poll(() => projectPhoto.evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(0);
    if (width === 390) {
      const visual = popup.locator('.enquiry-popup-visual');
      const content = popup.locator('.enquiry-popup-content');
      const visualBounds = await visual.boundingBox();
      const contentBounds = await content.boundingBox();
      expect(visualBounds!.height).toBeGreaterThanOrEqual(140);
      expect(visualBounds!.y + visualBounds!.height).toBeLessThanOrEqual(contentBounds!.y);
    }
    await expect(page.locator('body')).toHaveCSS('overflow', 'hidden');
    await expect(popup.getByLabel('Full name')).toHaveAttribute('required', '');
    await popup.getByLabel('Full name').fill('Test enquiry');
    await popup.getByLabel('Email address').fill('hello@example.com');
    await popup.getByLabel('Phone number').fill('9920177441');
    await popup.getByLabel('Project requirements').fill('Substation testing requirements');
    expect(await popup.locator('form').evaluate((form: HTMLFormElement) => form.checkValidity())).toBeTruthy();
    expect(await popup.evaluate(element => element.scrollWidth <= element.clientWidth)).toBeTruthy();
    await page.screenshot({ path: `test-results/enquiry-popup-${width}.png` });
    if (width === 390) await popup.getByRole('button', { name: 'Close enquiry form' }).click();
    else await page.keyboard.press('Escape');
    await expect(popup).not.toBeVisible();
    await expect(page.locator('body')).not.toHaveCSS('overflow', 'hidden');
    expect(errors).toEqual([]);
  });
}
