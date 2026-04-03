# 🎭 Playwright Healing Locators

A robust, easy-to-use helper library for Playwright that improves test stability by automatically resolving broken selectors.

When web UI structure changes are frequent (class renaming, attribute updates, dynamic ids), normal selectors break tests. This package helps by:

- ✅ Trying a second locator when primary fails (`regularHeal`)
- 🤖 Detecting similar elements based on selector keywords (`autoHeal`)
- 🎯 Supporting common locator methods (CSS, XPath, text, ARIA, role)
- 👀 Only continuing once a visible element is found, reducing false positives

## 🔍 The Problem & Solution

### ⚠️ Common Problem: Brittle selectors break tests
- UI changes happen all the time (CSS classes change, DOM structure shifts, IDs get regenerated, attributes are refactored).
- Traditional Playwright selectors (`page.locator('#x')`, `getByRole...`) fail immediately if the exact path is gone.
- Teams spend time constantly updating tests, creating flakiness and maintenance debt.

### 💡 Why This Package is Needed
- It reduces **fast failure** when the first selector is invalid.
- It avoids **unnecessary rework** by attempting recovery first.
- It gives a **safe second chance** to selectors without manual intervention.

### 🎉 What We Improved After Using This Package
- ✨ **Resilient tests**: a bad primary selector can change to fallback instead of failing test.
- 🔧 **Less maintenance**: one failing selector does not require immediate test patching.
- 🛡️ **Better coverage**: both normal (`regularHeal`) and self-healing (`autoHeal`) paths are protected.
- 🔐 **Higher confidence**: tests now verify actual element exists before action (`waitFor visible`).
- 📊 **Faster debugging**: healing logs show which attempt worked.

## ⭐ Features

- `regularHeal`: manual fallback locators (primary + fallback array)
- `autoHeal`: automatic healing by keyword matching and candidate scoring
- Supports CSS, XPath, text, ARIA label, and role-based selectors
- Built-in retry with visibility wait

## 📦 Installation

```bash
npm install playwright-healing-locators
```

## 🚀 Usage

```js
import { test, expect } from '@playwright/test';
import { regularHeal, autoHeal } from 'playwright-healing-locators';

test('Regular Healing with fallback', async ({ page }) => {
  await page.goto('https://practicetestautomation.com/practice-test-login/');

  await regularHeal.fill(page, {
    primary: '#wrong-username',
    fallbacks: [
      { type: 'role', value: 'textbox', name: 'Username' }
    ]
  }, 'student');

  await regularHeal.fill(page, {
    primary: '#wrong-password',
    fallbacks: [
      { type: 'role', value: 'textbox', name: 'Password' }
    ]
  }, 'Password123');

  await regularHeal.click(page, {
    primary: '#wrong-submit',
    fallbacks: [
      { type: 'role', value: 'button', name: 'Submit' }
    ]
  });

  await expect(page.getByText('Logged In Successfully')).toBeVisible();
});
```

```js
test('Auto Healing with keyword-based candidate search', async ({ page }) => {
  await page.goto('https://practicetestautomation.com/practice-test-login/');

  await autoHeal.fill(page, {
    primary: '#username-field-invalid'
  }, 'student');

  await autoHeal.fill(page, {
    primary: '#password-field-invalid'
  }, 'Password123');

  await autoHeal.click(page, {
    primary: '#submit-btn-invalid'
  });

  await expect(page.getByText('Logged In Successfully')).toBeVisible();
});
```

## 📚 API

### ✍️ `regularHeal.fill(page, options, value)`
- `page`: Playwright page
- `options.primary`: CSS/XPath primary selector
- `options.fallbacks`: Array of fallback { type, value, name? }
- `value`: text to fill

### 🖱️ `regularHeal.click(page, options)`
- `page`: Playwright page
- `options.primary`: CSS/XPath primary selector
- `options.fallbacks`: Array of fallback { type, value, name? }

### ✍️ `autoHeal.fill(page, options, value)`
- `page`: Playwright page
- `options.primary`: primary selector to auto-heal from
- `value`: text to fill

### 🖱️ `autoHeal.click(page, options)`
- `page`: Playwright page
- `options.primary`: primary selector to auto-heal from

## 🤝 Contribution

1. 🍴 Fork repository
2. 🌿 Create feature branch
3. ✅ Add tests in `tests/*.spec.ts`
4. 📤 Submit PR

## ⚠️ Limitations & Known Issues

While this package improves test resilience, be aware of these considerations:

### ⏱️ Performance Impact
- `autoHeal` searches the DOM for candidate elements, which may be slower on large/complex pages
- Multiple fallback attempts in `regularHeal` add execution time
- Consider using `regularHeal` for known stable fallbacks vs `autoHeal` for unpredictable UIs

### 🎯 Accuracy Risks
- `autoHeal` keyword matching might select incorrect elements if multiple similar elements exist
- Always verify healing results in test reports and adjust primary selectors when possible
- False positives possible if element attributes match but context differs

### 🔄 Maintenance Overhead
- `regularHeal` requires manual fallback definitions that need updates when UI changes
- Auto-healing might mask underlying selector problems that should be fixed
- Regular review of healing logs recommended to identify patterns

### 🐛 Debugging Challenges
- When healing fails completely, error messages may not pinpoint the exact issue
- Healing logs help but require interpretation
- Complex DOM structures may confuse keyword extraction

### 🌐 Browser Compatibility
- Tested on Chromium, Firefox, and WebKit as configured
- XPath support may vary slightly between browsers
- Mobile testing not yet validated

### 📦 Dependencies
- Requires Playwright `^1.59.1` (may work with newer but not guaranteed)
- ES modules required (not CommonJS compatible)

## 💻 Best Practices

- Use `regularHeal` for predictable, stable fallbacks
- Use `autoHeal` for dynamic content or when exact selectors are unreliable
- Monitor healing logs to identify frequently failing selectors
- Combine with good locator strategies (prefer roles/ARIA over fragile CSS)
- Don't rely solely on healing - fix underlying UI issues when possible

## 📝 Notes

- Use a stable version of Playwright `^1.59.1`.
- Ensure `playwright.config.js` uses `reporter: 'html'` if you need HTML test reports.

## 📄 License

This project is released under the **ISC License** - a permissive open-source license suitable for commercial and open-source projects.

See the [LICENSE](LICENSE) file for details.
