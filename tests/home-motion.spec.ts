import { test, expect, type Page } from '@playwright/test';

async function openHome(page: Page) {
  await page.goto('/');
  await expect(page.locator('.site-preloader')).toHaveCount(0, { timeout: 8000 });
  await expect(page.locator('.hero-actions .button')).toHaveCSS('opacity', '1');
}

async function triggers(page: Page) {
  return page.evaluate(async () => {
    const resource = performance.getEntriesByType('resource').find(entry => entry.name.includes('/gsap_ScrollTrigger.js'));
    if (!resource) return [];
    const { ScrollTrigger } = await import(/* @vite-ignore */ resource.name);
    return ScrollTrigger.getAll().map((trigger: { trigger?: HTMLElement; start: number; end: number; pin?: unknown }) => ({
      name: trigger.trigger?.className ?? '', start: trigger.start, end: trigger.end, pin: Boolean(trigger.pin),
    }));
  });
}

async function scrollTo(page: Page, top: number) {
  await page.evaluate(top => window.scrollTo({ top, behavior: 'instant' }), top);
  await page.waitForTimeout(850); // Allow the bounded scrub smoothing to settle.
}

test('desktop cinematic hero, service interaction, project layers and industry reel', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await openHome(page);
  await expect(page.locator('.hero-banner-image')).toHaveCSS('clip-path', 'inset(0px 0px 0%)');
  await expect(page.locator('.hero-line')).toHaveCount(4);
  await page.screenshot({ path: 'test-results/motion-review/desktop-hero.png' });

  const expertise = page.locator('#expertise');
  await expertise.scrollIntoViewIfNeeded();
  await page.getByRole('tab', { name: 'EPC & Project Execution', exact: true }).focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('tab', { name: 'Solar & Renewable Energy', exact: true })).toBeFocused();
  await expect(expertise.locator('.expertise-explore')).toHaveAttribute('href', '/services/solar-ev-station');

  const projectTop = await page.locator('.project-showcase').evaluate(element => element.getBoundingClientRect().top + scrollY);
  await scrollTo(page, projectTop + 150);
  const firstProject = page.locator('.project-showcase-card').first();
  const rect = await firstProject.boundingBox();
  expect(rect?.y).toBeGreaterThanOrEqual(110);
  expect(rect?.y).toBeLessThan(116);
  await expect(firstProject).toHaveAttribute('href', '/services/epc-projects');
  await page.screenshot({ path: 'test-results/motion-review/desktop-projects.png' });

  const reel = (await triggers(page)).find(trigger => trigger.name.includes('industries-home'))!;
  expect(reel.pin).toBeTruthy();
  expect(reel.end - reel.start).toBeLessThanOrEqual(900);
  await scrollTo(page, (reel.start + reel.end) / 2);
  await expect(page.locator('.industry-current-title')).not.toHaveText('Power Utilities');
  await expect(page.locator('.industry-track')).not.toHaveCSS('transform', 'none');
  expect(await page.evaluate(() => document.body.scrollWidth <= innerWidth)).toBeTruthy();
  await page.screenshot({ path: 'test-results/motion-review/desktop-industries.png' });
  await page.locator('.industry-slide').last().focus();
  await expect(page.locator('.industry-current-title')).toHaveText('Pharmaceutical');
  await page.setViewportSize({ width: 768, height: 900 });
  await expect(page.locator('.industry-track')).toHaveCSS('display', 'grid');
  expect((await triggers(page)).some(trigger => trigger.name.includes('industries-home') && trigger.pin)).toBeFalsy();
  expect(await page.evaluate(() => document.body.scrollWidth <= innerWidth)).toBeTruthy();

  // SPA navigation must dispose every homepage trigger and sticky spacer.
  await page.getByRole('button', { name: 'Open navigation' }).click();
  await page.getByRole('dialog', { name: 'Navigation' }).locator('a[href="/about"]').click();
  await expect(page).toHaveURL(/\/about$/);
  expect(await triggers(page)).toHaveLength(0);
  await expect(page.locator('.pin-spacer')).toHaveCount(0);
  await expect(page.locator('.contact-band')).not.toHaveClass(/motion-cta/);
  expect(errors).toEqual([]);
});

for (const width of [320, 390, 768]) {
  test(`touch layout at ${width}px keeps images, links and native vertical scrolling`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    await openHome(page);
    expect((await triggers(page)).some(trigger => trigger.name.includes('industries-home') && trigger.pin)).toBeFalsy();
    await expect(page.locator('.industry-slide')).toHaveCount(6);
    await expect(page.locator('.project-showcase-card')).toHaveCount(8);
    await expect(page.locator('.project-showcase-card').first()).not.toHaveCSS('position', 'sticky');
    await expect(page.locator('.industry-track')).toHaveCSS('display', 'grid');

    // Visit every main section so lazy images and all entry animations are exercised.
    for (const selector of ['.about-block', '.expertise-section', '.projects-section', '.industries-home', '.home-contact', '.contact-band']) {
      await page.locator(selector).scrollIntoViewIfNeeded();
      await page.waitForTimeout(1100);
      expect(await page.evaluate(() => document.body.scrollWidth <= innerWidth), selector).toBeTruthy();
    }
    const badImages = await page.locator('.home-page img').evaluateAll(images => images.filter(image => (image as HTMLImageElement).complete && !(image as HTMLImageElement).naturalWidth).map(image => image.getAttribute('src')));
    expect(badImages).toEqual([]);
    await page.locator('.industries-home').scrollIntoViewIfNeeded();
    await page.screenshot({ path: `test-results/motion-review/industries-${width}.png` });
    await page.getByRole('button', { name: 'Open navigation' }).click();
    await page.getByRole('dialog', { name: 'Navigation' }).locator('a[href="/services"]').click();
    await expect(page).toHaveURL(/\/services$/);
    await expect(page.locator('.services-layout')).toBeVisible();
  });
}

test('reduced motion leaves content visible and disables all pinned experiences', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await openHome(page);
  expect(await triggers(page)).toHaveLength(0);
  await expect(page.locator('.pin-spacer')).toHaveCount(0);
  await expect(page.locator('.industry-track')).toHaveCSS('display', 'grid');
  await expect(page.locator('.project-showcase-card').first()).not.toHaveCSS('position', 'sticky');
  await expect(page.locator('.about-photo')).toHaveCSS('opacity', '1');
  await page.locator('.home-contact').scrollIntoViewIfNeeded();
  await expect(page.locator('.home-contact-card').first()).toBeVisible();
});
