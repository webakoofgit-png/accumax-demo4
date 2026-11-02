import { test, expect, type Page } from '@playwright/test';

async function openHome(page: Page) {
  await page.goto('/');
  await expect(page.locator('.industry-windows')).toBeAttached();
  await page.locator('.enquiry-popup').evaluate((dialog: HTMLDialogElement) => {
    const observer = new MutationObserver(() => { if (dialog.open) dialog.close(); });
    observer.observe(dialog, { attributes: true, attributeFilter: ['open'] });
    if (dialog.open) dialog.close();
  });
}

test('autoplay advances after 2.5 seconds and pauses for keyboard focus', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await openHome(page);
  await expect(page.locator('.site-preloader')).toHaveCount(0);
  const section = page.locator('.industry-windows');
  await section.scrollIntoViewIfNeeded();
  await page.mouse.move(0, 0);
  const tabs = section.getByRole('tab');
  await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true', { timeout: 7000 });
  await tabs.nth(1).focus();
  await page.waitForTimeout(4500);
  await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true');
  await tabs.nth(1).evaluate(element => (element as HTMLElement).blur());
  await expect(tabs.nth(2)).toHaveAttribute('aria-selected', 'true', { timeout: 7000 });
});

for (const width of [390, 1440]) {
  test(`cinematic industries at ${width}px: selection, keyboard, images and enquiry`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    await openHome(page);
    await expect(page.locator('.site-preloader')).toHaveCount(0);
    const section = page.locator('.industry-windows');
    await section.scrollIntoViewIfNeeded();
    const tabs = section.getByRole('tab');
    await expect(tabs).toHaveCount(6);
    await expect(section.locator('.iw-panel')).toHaveCount(0);
    await expect.poll(() => section.locator('.iw-photo').first().evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThanOrEqual(1600);
    await tabs.nth(1).click();
    await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true');
    await expect(section.locator('.iw-cta')).toHaveAttribute('href', '/contact?industry=Data%20Centers');
    await expect(section.locator('.iw-layer').nth(1)).toHaveCSS('visibility', 'visible');
    await tabs.nth(1).press('End');
    await expect(tabs.last()).toBeFocused();
    await expect(tabs.last()).toHaveAttribute('aria-selected', 'true');
    await expect(section.locator('.iw-cta')).toHaveAttribute('href', '/contact?industry=Pharmaceutical');
    await tabs.last().press('Home');
    await expect(tabs.first()).toHaveAttribute('aria-selected', 'true');
    // A rapid series of requests must settle on the final requested industry.
    await section.evaluate(element => {
      const buttons = element.querySelectorAll<HTMLButtonElement>('[role=tab]');
      buttons[2].click(); buttons[4].click(); buttons[3].click();
    });
    await expect(tabs.nth(3)).toHaveAttribute('aria-selected', 'true');
    await expect(section.locator('.iw-layer').nth(3)).toHaveCSS('opacity', '1');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
    await page.screenshot({ path: `test-results/industry-windows-${width}.png`, fullPage: false });
    await section.locator('.iw-cta').click();
    await expect(page).toHaveURL(/contact\?industry=Refineries/);
    expect(errors).toEqual([]);
  });
}

test('reduced motion selects instantly without animation', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await openHome(page);
  const section = page.locator('.industry-windows');
  await section.scrollIntoViewIfNeeded();
  await section.getByRole('tab').nth(2).click();
  await expect(section.getByRole('tab').nth(2)).toHaveAttribute('aria-selected', 'true');
  await expect(section.locator('.iw-layer').nth(2)).toHaveCSS('opacity', '1');
});
