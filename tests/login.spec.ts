import { test, expect, Page } from '@playwright/test';
import { autoHeal, regularHeal } from '../src';

test.describe('Playwright Healing Locators', () => {

  // Test case 1: verify baseline login flow without healing features
  // This ensures the app works with stable selectors.
  test('Baseline: Normal Playwright (no healing)', async ({ page }: { page: Page }) => {
    await page.goto('https://practicetestautomation.com/practice-test-login/');

    await page.getByRole('textbox', { name: 'Username' }).fill('student');
    await page.getByRole('textbox', { name: 'Password' }).fill('Password123');
    await page.getByRole('button', { name: 'Submit' }).click();

    await expect(
      page.getByText('Logged In Successfully')
    ).toBeVisible();
  });

    // Test case 2: verify regular heal flow with explicit manual fallbacks
  // This test uses an invalid primary locator for each field and ensures the helper
  // successfully falls back to a working locator (text/role/etc.) before acting.
  test('Regular Mode: With fallback', async ({ page }: { page: Page }) => {
    await page.goto('https://practicetestautomation.com/practice-test-login/');

    // Username (wrong selector + fallback)
    await regularHeal.fill(page, {
      primary: '#wrong-username',
      fallbacks: [
        { type: 'text', value: 'Username' },
        { type: 'css', value: 'input[name="username"]' },
        { type: 'role', value: 'textbox', name: 'Username' }
      ]
    }, 'student');

    // Password
    await regularHeal.fill(page, {
      primary: '#wrong-password',
      fallbacks: [
        { type: 'text', value: 'Password' },
        { type: 'css', value: 'input[type="password"]' },
        { type: 'role', value: 'textbox', name: 'Password' }
      ]
    }, 'Password123');

    // Submit
    await regularHeal.click(page, {
      primary: '#wrong-submit',
      fallbacks: [
        { type: 'text', value: 'Submit' },
        { type: 'css', value: 'input[type="submit"]' },
        { type: 'role', value: 'button', name: 'Submit' }
      ]
    });

    await expect(
      page.getByText('Logged In Successfully')
    ).toBeVisible();
  });

  // Test case 3: verify auto-heal flow without explicit fallbacks
  // This test uses incorrect primary selectors and confirms autoHeal can detect
  // and use alternate matching elements automatically for click/fill.
  test('Auto Mode: Self-healing without fallback', async ({ page }: { page: Page }) => {
    await page.goto('https://practicetestautomation.com/practice-test-login/');

    // Username (completely wrong selector)
    await autoHeal.fill(page, {
      primary: '#username-field-invalid'
    }, 'student');

    // Password
    await autoHeal.fill(page, {
      primary: '#password-field-invalid'
    }, 'Password123');

    // Submit
    await autoHeal.click(page, {
      primary: '#submit-btn-invalid'
    });

    await expect(
      page.getByText('Logged In Successfully')
    ).toBeVisible();
  });

});