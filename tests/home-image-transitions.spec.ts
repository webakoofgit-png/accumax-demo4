import { test, expect } from '@playwright/test';

test('homepage photo carousels keep the current frame while the next image is delayed', async ({ page }) => {
  const hold = async (filename: string) => {
    let release!: () => void;
    let requested!: () => void;
    const gate = new Promise<void>(resolve => { release = resolve; });
    const started = new Promise<void>(resolve => { requested = resolve; });
    await page.route(url => decodeURIComponent(url.pathname).endsWith(filename), async route => {
      if (route.request().resourceType() !== 'image') {
        await route.continue();
        return;
      }
      requested();
      await gate;
      await route.continue();
    });
    return { started, release };
  };

  const storyPhoto = await hold('/industry-plastics-1600.webp');
  const engineeringPhoto = await hold('/ehouse-installation.jpg');
  const industryPhoto = await hold('/industry-data-centres.jpg');
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.locator('.enquiry-popup').evaluate((dialog: HTMLDialogElement) => {
    new MutationObserver(() => { if (dialog.open) dialog.close(); }).observe(dialog, { attributes: true, attributeFilter: ['open'] });
    if (dialog.open) dialog.close();
  });

  try {
    const story = page.locator('.story--carousel');
    await story.scrollIntoViewIfNeeded();
    await expect.poll(() => story.locator('.story-photo img').evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(0);
    await story.getByRole('button', { name: 'Next approach' }).click();
    await storyPhoto.started;
    await expect(story).toHaveAttribute('data-active', '0');
    await expect(story.locator('.story-photo img')).toHaveAttribute('src', /\/industry-cement\.jpg$/);
    storyPhoto.release();
    await expect(story).toHaveAttribute('data-active', '1');
    await expect(story.locator('.story-photo .image-crossfade-out')).toHaveCSS('background-image', /\/industry-cement\.jpg/);

    const engineering = page.locator('#engineering-path');
    const surface = engineering.locator('.ke-surface');
    await engineering.getByRole('button', { name: 'Next engineering stage' }).click();
    await engineeringPhoto.started;
    await expect(engineering).toHaveAttribute('data-active', '0');
    await expect(surface).toHaveCSS('background-image', /electrical-epc\.jpg/);
    engineeringPhoto.release();
    await expect(engineering).toHaveAttribute('data-active', '1');
    await expect(surface.locator('.image-crossfade-out')).toHaveCSS('background-image', /electrical-epc\.jpg/);

    const industries = page.locator('.industry-windows');
    const tabs = industries.getByRole('tab');
    await tabs.nth(1).click();
    await industryPhoto.started;
    await expect(tabs.first()).toHaveAttribute('aria-selected', 'true');
    await expect(industries.locator('.iw-layer').first()).toHaveCSS('opacity', '1');
    industryPhoto.release();
    await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true');
    await expect(industries.locator('.iw-layer').nth(1)).toHaveCSS('opacity', '1');
  } finally {
    storyPhoto.release();
    engineeringPhoto.release();
    industryPhoto.release();
  }
});
