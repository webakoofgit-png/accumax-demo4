import { test, expect, type Locator } from '@playwright/test';

const endpoint = 'https://api.web3forms.com/submit';

for (const width of [390, 1440]) {
  for (const kind of ['contact', 'popup'] as const) {
    test(`${kind} sends through Web3Forms and supports retry at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ reducedMotion: 'reduce' });
      let attempt = 0;
      let payload = '';
      await page.route(endpoint, async route => {
        attempt++;
        payload = route.request().postData() ?? '';
        await route.fulfill({
          status: attempt === 1 ? 429 : 200,
          json: attempt === 1 ? { success: false, message: 'Please try again shortly.' } : { success: true },
        });
      });
      await page.goto('/contact?industry=Data%20Centers');
      await expect(page.locator('.site-preloader')).toHaveCount(0);
      let form: Locator;
      if (kind === 'popup') {
        await page.locator('dialog.enquiry-popup').evaluate((dialog: HTMLDialogElement) => dialog.showModal());
        form = page.locator('dialog.enquiry-popup form');
      } else {
        await page.locator('dialog.enquiry-popup').evaluate((dialog: HTMLDialogElement) => {
          const close = () => dialog.close();
          new MutationObserver(close).observe(dialog, { attributes: true, attributeFilter: ['open'] });
          close();
        });
        form = page.locator('.contact-layout form');
      }
      await form.getByRole('button', { name: 'Send enquiry', exact: true }).click();
      expect(attempt).toBe(0);
      await form.locator('[name=name]').fill('Website reviewer');
      await form.locator('[name=email]').fill('review@example.com');
      await form.locator('[name=phone]').fill('9920177441');
      await form.locator('[name=message]').fill('Please discuss our engineering requirements.');
      if (kind === 'contact') await form.getByRole('checkbox').check();
      else await form.locator('[name=service]').selectOption('Live Electric Panel Cleaning');
      await form.getByRole('button', { name: 'Send enquiry', exact: true }).click();
      await expect(form.getByRole('alert')).toHaveText('Please try again shortly.');
      await expect(form.locator('[name=name]')).toHaveValue('Website reviewer');
      await expect(form.getByRole('status')).toHaveCount(0);
      await form.getByRole('button', { name: 'Send enquiry', exact: true }).click();
      await expect(form.getByRole('status')).toContainText('Your enquiry has been sent successfully.');
      await expect(form.getByRole('button', { name: 'Enquiry sent', exact: true })).toBeDisabled();
      expect(attempt).toBe(2);
      for (const value of ['676251c3-6762-4d09-b427-b7cc24510dd7', 'review@example.com', 'Website reviewer', 'name="replyto"', 'name="page_url"']) expect(payload).toContain(value);
      expect(payload).toContain(kind === 'contact' ? 'Data Centers' : 'Live Electric Panel Cleaning enquiry');
    });
  }
}

test('a network failure or rejected API result never reports a sent enquiry', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  let requests = 0;
  await page.route(endpoint, async route => {
    requests++;
    if (requests === 1) await route.abort('failed');
    else await route.fulfill({ json: { success: false, message: 'Access key is not valid.' } });
  });
  await page.goto('/contact?service=EPC%20Projects');
  await expect(page.locator('.site-preloader')).toHaveCount(0);
  const form = page.locator('.contact-layout form');
  await form.locator('[name=name]').fill('Failure test');
  await form.locator('[name=email]').fill('test@example.com');
  await form.locator('[name=phone]').fill('9920177441');
  await form.locator('[name=message]').fill('Keep my enquiry if sending fails.');
  await form.getByRole('checkbox').check();
  await form.getByRole('button', { name: 'Send enquiry', exact: true }).click();
  await expect(form.getByRole('alert')).toContainText('Unable to connect');
  await expect(form.getByRole('status')).toHaveCount(0);
  await form.getByRole('button', { name: 'Send enquiry', exact: true }).click();
  await expect(form.getByRole('alert')).toHaveText('Access key is not valid.');
  await expect(form.getByRole('status')).toHaveCount(0);
  await expect(form.locator('[name=message]')).toHaveValue('Keep my enquiry if sending fails.');
});
