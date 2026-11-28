import { test, expect } from '@playwright/test';

for (const width of [320, 390, 1440]) {
  test(`Projects navigation, filters and footer contact at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/projects');
    await expect(page.locator('.site-preloader')).toHaveCount(0);
    const popup = page.locator('dialog.enquiry-popup');
    if (await popup.isVisible()) await popup.getByRole('button', { name: 'Close enquiry form' }).click();
    await expect(page).toHaveTitle('Electrical Engineering Project Applications | Accumax Controls');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Engineering in action.');
    await expect(page.locator('.projects-page-card')).toHaveCount(6);
    await expect(page.getByText(/sample project profile shown for design review/i)).toHaveCount(0);
    await expect(page.locator('header.header a[href="/contact"]')).toHaveCount(0);

    if (width < 1200) {
      await page.getByRole('button', { name: 'Open navigation' }).click();
      const menu = page.getByRole('dialog', { name: 'Navigation' });
      await expect(menu.locator('a[href="/contact"]')).toHaveCount(0);
      await menu.locator('a[href="/projects"]').click();
    } else {
      await expect(page.getByRole('navigation', { name: 'Primary navigation' }).getByRole('link', { name: 'Projects', exact: true })).toHaveAttribute('href', '/projects');
    }

    await page.getByRole('button', { name: 'Solar', exact: true }).click();
    await expect(page.locator('.projects-page-card')).toHaveCount(1);
    await expect(page.locator('.projects-page-count')).toHaveText('1 project profile / Solar');
    await page.getByRole('button', { name: 'All projects', exact: true }).click();
    await expect(page.locator('.projects-page-card')).toHaveCount(6);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBeTruthy();
    await page.screenshot({ path: `test-results/projects-page-${width}.png`, fullPage: true });
    await expect(page.locator('.projects-page-grid').getByRole('link')).toHaveCount(0);
    await page.locator('.projects-page-image').first().click();
    await expect(page).toHaveURL(/\/projects$/);

    await page.locator('footer').getByRole('link', { name: 'Get in Touch', exact: true }).click();
    await expect(page).toHaveURL(/\/contact$/);
    await expect(page.locator('.contact-layout form')).toBeVisible();
    await page.locator('footer').getByRole('link', { name: 'Featured Works', exact: true }).click();
    await expect(page).toHaveURL(/\/featured-works$/);
    await expect(page.locator('.project-grid .project-card')).toHaveCount(6);
    await expect(page.locator('.project-grid').getByText('SAMPLE PROJECT', { exact: true })).toHaveCount(0);
    await expect(page.locator('.project-grid').getByText(/location · to be verified/i)).toHaveCount(0);
    await expect(page.locator('.project-grid').getByRole('link')).toHaveCount(0);
    await page.locator('.project-grid .project-image').first().click();
    await expect(page).toHaveURL(/\/featured-works$/);
    await page.goto('/projects/gis-substation-erection');
    await expect(page.locator('main .not-found')).toBeVisible();
  });
}
