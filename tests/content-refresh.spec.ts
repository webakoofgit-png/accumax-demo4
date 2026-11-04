import { expect, test } from '@playwright/test';

const services = [
  ['epc-projects', 'EPC Projects'],
  ['scada-relay-testing', 'SCADA & Relay Testing'],
  ['export', 'Export'],
  ['substation-testing-commissioning', 'Substation Testing & Commissioning'],
  ['fabrication-civil-work', 'Fabrication & Civil Work'],
  ['gis-erection-supervision', 'GIS Erection & Supervision'],
  ['solar-ev-station', 'Solar & EV Station'],
  ['trading', 'Trading'],
];

for (const width of [390, 1440]) {
  test(`service briefs lead to the correct enquiry at ${width}px`, async ({ page }) => {
    test.setTimeout(120000);
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));

    for (const [slug, title] of services) {
      await page.goto(`/services/${slug}`);
      await expect(page.locator('.site-preloader')).toHaveCount(0);
      await expect(page.locator('h1')).toHaveText(title);
      const brief = page.getByRole('complementary', { name: 'A useful first conversation starts here.' });
      await expect(brief).toBeAttached();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), title).toBe(true);
      await brief.getByRole('link', { name: 'Tell us about your project' }).click();
      await expect(page).toHaveURL(new RegExp('/contact\\?service='));
      await expect(page.locator('.contact-layout select[name="interest"]')).toHaveValue(title);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), title).toBe(true);
    }
    expect(errors).toEqual([]);
  });
}
