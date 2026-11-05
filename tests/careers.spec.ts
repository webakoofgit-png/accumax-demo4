import { expect, test } from '@playwright/test';
import { readFile } from 'node:fs/promises';

for (const width of [390, 1200, 1440]) {
  test(`career application validation and resume email draft at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const posts: string[] = [];
    const errors: string[] = [];
    page.on('request', request => { if (request.method() === 'POST') posts.push(request.url()); });
    page.on('pageerror', error => errors.push(error.message));
    await page.goto('/careers');
    await expect(page.locator('.site-preloader')).toHaveCount(0);
    await page.locator('.enquiry-popup').evaluate((dialog: HTMLDialogElement) => {
      const close = () => { if (dialog.open) dialog.close(); };
      new MutationObserver(close).observe(dialog, { attributes: true, attributeFilter: ['open'] });
      close();
    });
    await expect(page.getByRole('heading', { level: 1, name: 'Build your next chapter with us.' })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);

    const form = page.locator('#career-application');
    await form.getByRole('button', { name: 'Prepare application email', exact: true }).click();
    await expect(form.locator('input:invalid').first()).toHaveAttribute('id', 'career-name');
    await form.getByLabel('Full name').fill('Demo Candidate');
    await form.getByLabel('Email address').fill('candidate@example.com');
    await form.getByLabel('Phone number').fill('+91 98765 43210');
    await form.getByLabel('Current location').fill('Pune, Maharashtra');
    await form.getByLabel('Education / qualification').fill('BE Electrical Engineering');
    expect((await form.locator('#career-interest option').allTextContents()).slice(1)).toEqual((await page.locator('.enquiry-popup select[name="service"] option').allTextContents()).slice(1));
    await form.getByLabel('Area of interest').selectOption('Substation Testing & Commissioning');
    await form.getByLabel('Total experience').selectOption('1–3 years');
    await form.getByLabel('Availability / notice period').selectOption('Within 30 days');
    await form.getByLabel('Tell us about your skills and interests').fill('Relay testing and site commissioning experience.');

    await form.getByLabel('Resume / CV').setInputFiles({ name: 'resume.txt', mimeType: 'text/plain', buffer: Buffer.from('Example') });
    await expect(form.getByRole('alert')).toContainText('PDF, DOC or DOCX');
    await form.getByLabel('Resume / CV').setInputFiles({ name: 'large.pdf', mimeType: 'application/pdf', buffer: Buffer.alloc(2 * 1024 * 1024 + 1) });
    await expect(form.getByRole('alert')).toContainText('2 MB');

    const resume = Buffer.from('%PDF-1.4\nDemo resume\n%%EOF');
    await form.getByLabel('Resume / CV').setInputFiles({ name: 'candidate-resume.pdf', mimeType: 'application/pdf', buffer: resume });
    await form.getByRole('checkbox').check();
    await form.getByRole('button', { name: 'Prepare application email', exact: true }).click();
    await expect(form.getByRole('status')).toContainText('Your application email is ready.');
    const downloadPromise = page.waitForEvent('download');
    await form.getByRole('link', { name: 'Download application email' }).click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe('Accumax-career-application.eml');
    const draft = await readFile((await download.path())!, 'utf8');
    expect(draft).toContain('X-Unsent: 1');
    expect(draft).toContain('To: info@accumaxcontrols.com');
    expect(draft).toContain('filename="candidate-resume.pdf"');
    expect(draft).toContain(resume.toString('base64'));
    const body = draft.match(/Content-Type: text\/plain; charset=UTF-8\r\nContent-Transfer-Encoding: base64\r\n\r\n([\s\S]*?)\r\n\r\n--/)!;
    expect(Buffer.from(body[1].replace(/\s/g, ''), 'base64').toString('utf8')).toContain('Full name: Demo Candidate');
    expect(posts).toEqual([]);
    expect(errors).toEqual([]);
    await form.getByLabel('Full name').fill('Updated Candidate');
    await expect(form.getByRole('status')).toHaveCount(0);
    await page.goto('/contact');
    expect((await page.locator('select[name="interest"] option').allTextContents()).slice(1)).toEqual((await page.locator('.enquiry-popup select[name="service"] option').allTextContents()).slice(1));
    await page.goto('/contact?industry=Data%20Centers');
    await expect(page.locator('select[name="interest"]')).toHaveValue('Data Centers');

  });
}
