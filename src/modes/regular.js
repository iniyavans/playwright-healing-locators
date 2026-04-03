/**
 * Regular Healing Mode Module
 * This module provides manual fallback-based healing for Playwright locators.
 * When a primary selector fails, it tries a series of fallback selectors in order.
 */

// Import the core healing function that handles the logic of trying selectors
import { regularHeal } from '../core/healer.js';

/**
 * Performs a click action using regular healing strategy.
 * @param {Page} page - The Playwright page object
 * @param {Object} options - Configuration object containing primary selector and fallbacks
 * @param {string} options.primary - The main CSS or XPath selector to try first
 * @param {Array} options.fallbacks - Array of fallback selector objects with type and value
 * @param {number} [options.timeout=2000] - Timeout in milliseconds for each selector attempt
 * @param {boolean} [options.log=true] - Whether to log healing attempts to console
 */
async function click(page, options) {
  // Call the core healing function to get a working locator
  const locator = await regularHeal(page, options);
  // Perform the click action on the found locator
  await locator.click();
}

/**
 * Performs a fill action using regular healing strategy.
 * @param {Page} page - The Playwright page object
 * @param {Object} options - Configuration object containing primary selector and fallbacks
 * @param {string} options.primary - The main CSS or XPath selector to try first
 * @param {Array} options.fallbacks - Array of fallback selector objects with type and value
 * @param {number} [options.timeout=2000] - Timeout in milliseconds for each selector attempt
 * @param {boolean} [options.log=true] - Whether to log healing attempts to console
 * @param {string} value - The text value to fill into the input field
 */
async function fill(page, options, value) {
  // Call the core healing function to get a working locator
  const locator = await regularHeal(page, options);
  // Fill the input field with the provided value
  await locator.fill(value);
}

// Export the functions so they can be used by other modules
export { click, fill };