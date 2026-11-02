import assert from 'node:assert/strict';
import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

const runtime = resolve('test-results/mobile-runtime');
mkdirSync(runtime, { recursive: true });
process.env.TEMP = runtime;
process.env.TMP = runtime;
const { chromium } = await import('@playwright/test');
const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', args: ['--single-process', '--no-zygote', '--disable-gpu'] });
const context = await browser.newContext({ hasTouch: true, isMobile: true, viewport: { width: 320, height: 568 } });
await context.addInitScript(() => {
  window.__qaModalAllowed = false;
  window.addEventListener('DOMContentLoaded', () => new MutationObserver(records => {
    for (const { target } of records) if (target instanceof HTMLDialogElement && target.matches('.enquiry-popup[open]') && !window.__qaModalAllowed) target.close();
  }).observe(document.documentElement, { attributes: true, attributeFilter: ['open'], subtree: true }));
});
const page = await context.newPage();
const errors = [];
page.on('pageerror', error => errors.push(error.message));
const until = async (check, label) => {
  const end = Date.now() + 6000;
  while (Date.now() < end) { if (await check()) return; await page.waitForTimeout(100); }
  throw new Error(label);
};
const noOverflow = async () => assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), 'Horizontal page overflow');
try {
  const sizes = process.env.MOBILE_QA_SIZES?.split(',').map(size => size.split('x').map(Number)) ?? [[320, 568], [390, 844], [768, 1024], [1024, 768], [844, 390]];
  for (const [width, height] of sizes) {
    await page.setViewportSize({ width, height });
    await page.goto('http://127.0.0.1:4174/');
    await page.waitForSelector('#engineering-path');
    await page.waitForSelector('.site-preloader', { state: 'detached' });
    await noOverflow();
    assert.equal(await page.locator('#engineering-path').getAttribute('data-enhanced'), 'true', 'Mobile must retain the desktop kinetic experience');
    assert.equal(await page.locator('.pin-spacer:has(.ke-surface)').count(), 1, 'Only the requested kinetic section should pin on touch');
    assert.equal(await page.locator('.pin-spacer').count(), 1, 'Other touch sections must keep native scrolling');
    assert.equal(await page.locator('.perspective-service-body').first().evaluate(element => getComputedStyle(element).opacity), '1', 'Touch users must see card details without hovering');
    await page.getByRole('button', { name: 'Open navigation' }).click();
    const navigation = page.getByRole('dialog', { name: 'Navigation' });
    await navigation.waitFor({ state: 'visible' });
    await navigation.locator('a[href="/contact"]').click();
    await page.waitForURL('**/contact');
    await until(async () => await navigation.count() === 0, 'Menu failed to close after navigation');
    assert(await page.locator('.contact-layout').evaluate(element => element.getBoundingClientRect().top >= document.querySelector('.header').getBoundingClientRect().bottom), 'Contact content is hidden behind the header');
    await page.locator('.contact-layout form').getByLabel('Full name').fill('Responsive review');
    await noOverflow();
    await page.evaluate(() => { window.__qaModalAllowed = true; document.querySelector('.enquiry-popup').showModal(); });
    const popup = page.locator('.enquiry-popup');
    await until(() => popup.evaluate(element => element.getAnimations().every(animation => animation.playState !== 'running')), 'Popup entrance did not settle');
    assert(await popup.evaluate(element => {
      const box = element.getBoundingClientRect();
      return box.top >= 8 && box.bottom <= innerHeight - 8;
    }), 'Popup extends beyond the mobile viewport');
    await popup.getByLabel('Full name').fill('Mobile reviewer');
    await popup.getByLabel('Phone number').fill('9920177441');
    await popup.getByLabel('Email address').fill('review@example.com');
    await popup.getByLabel('Project requirements').fill('Engineering requirements');
    assert(await popup.locator('form').evaluate(form => form.checkValidity()), 'Mobile enquiry validation failed');
    assert(await popup.evaluate(element => element.scrollWidth <= element.clientWidth + 1), 'Popup has horizontal overflow');
    await popup.evaluate(element => { element.scrollTop = element.scrollHeight; });
    const close = popup.getByRole('button', { name: 'Close enquiry form' });
    assert(await close.evaluate(element => {
      const box = element.getBoundingClientRect(), dialog = element.closest('dialog').getBoundingClientRect();
      return box.top >= dialog.top - 1 && box.bottom <= dialog.bottom + 1;
    }), 'Popup close button is unreachable after scrolling');
    await page.screenshot({ path: `test-results/mobile-popup-${width}x${height}.png` });
    await close.click();
    await page.evaluate(() => { window.__qaModalAllowed = false; });
    await page.locator('.header>a').first().click();
    await page.waitForURL('http://127.0.0.1:4174/');
    await until(() => page.locator('main').evaluate(element => getComputedStyle(element).opacity === '1'), 'Home route transition did not settle');
    await page.locator('#expertise').scrollIntoViewIfNeeded();
    const expertiseTabs = page.locator('#expertise .expertise-hotspot');
    await expertiseTabs.first().focus();
    await expertiseTabs.first().press('End');
    await until(async () => await expertiseTabs.last().getAttribute('aria-selected') === 'true', 'Expertise keyboard selection failed');
    await until(() => expertiseTabs.last().evaluate(element => {
      const box = element.getBoundingClientRect(), track = element.parentElement.getBoundingClientRect();
      return box.left >= track.left - 2 && box.right <= track.right + 2;
    }), 'Selected expertise tab is outside its scroll container');
    await page.locator('.industries-home').scrollIntoViewIfNeeded();
    await page.locator('#industry-selector-0').focus();
    await page.locator('#industry-selector-0').press('End');
    await until(async () => await page.locator('#industry-selector-5').getAttribute('aria-selected') === 'true', 'Industry keyboard selection failed');
    await until(() => page.locator('#industry-selector-5').evaluate(element => {
      const box = element.getBoundingClientRect(), track = element.parentElement.getBoundingClientRect();
      return box.left >= track.left - 2 && box.right <= track.right + 2;
    }), 'Selected industry tab is outside its scroll container');
    await noOverflow();
    assert(await page.locator('.iw-copy h3').evaluate(element => element.scrollWidth <= element.clientWidth + 2), 'Industry title is clipped');
    await page.screenshot({ path: `test-results/mobile-home-${width}x${height}.png` });
    assert.equal(await page.locator('.ac-comet-cursor').evaluate(element => getComputedStyle(element).display), 'none');
    console.log(`Passed real-image navigation, form, popup and tabs: ${width}x${height}`);
  }
  assert.deepEqual(errors, []);
  console.log('All mobile interaction checks passed.');
} finally { await browser.close(); }
