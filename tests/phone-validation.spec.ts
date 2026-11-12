import { test, expect } from '@playwright/test';
import { phoneError } from '../src/forms/phone';

test('phone validation checks length, characters, prefixes and repeated digits', () => {
  for (const value of ['', '99999999999', '9999999999', '+91 9999999999', '1234567', '99201774411', '99201abc41', '5123456789', '+12', '++919920177441']) {
    expect(phoneError(value), value).not.toBe('');
  }
  for (const value of ['9920177441', '+91 99201 77441', '98765-43210', '+1 415 555 2671', '+44 20 7946 0958']) {
    expect(phoneError(value), value).toBe('');
  }
});

for (const kind of ['contact', 'popup', 'careers']) {
  test(`${kind} shows a phone error and clears it after correction`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    let posts = 0;
    await page.route('https://api.web3forms.com/submit', async route => {
      posts++;await route.fulfill({ json: { success: true } });
    });
    await page.goto(kind === 'careers' ? '/careers' : '/contact');
    await expect(page.locator('.site-preloader')).toHaveCount(0);
    if (kind === 'popup') await page.locator('dialog.enquiry-popup').evaluate((dialog: HTMLDialogElement) => dialog.showModal());
    const form = page.locator(kind === 'popup' ? 'dialog.enquiry-popup form' : kind === 'careers' ? '#career-application' : '.contact-layout form');
    const phone = form.locator('input[name=phone]');
    for (const invalid of ['99999999999', '9999999999', 'abcd1234']) {
      await phone.fill(invalid);await phone.blur();
      await expect(phone).toHaveAttribute('aria-invalid', 'true');
      await expect(form.locator('.phone-field-error')).toBeVisible();
      expect(await phone.evaluate((input: HTMLInputElement) => input.checkValidity())).toBe(false);
      expect(posts).toBe(0);
    }
    await phone.fill('+91 9920177441');await phone.blur();
    await expect(form.locator('.phone-field-error')).toHaveCount(0);
    expect(await phone.evaluate((input: HTMLInputElement) => input.checkValidity())).toBe(true);
  });
}
