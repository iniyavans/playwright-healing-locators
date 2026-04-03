/**
 * Core Healing Logic Module
 * This module contains the fundamental healing algorithms used by both regular and auto modes.
 * It handles the process of trying multiple locators until one works.
 */

// Import functions for resolving locators and detecting selector types
import { resolveLocator, detectSelectorType } from './strategies.js';
// Import logging utility
import { log } from './logger.js';

/**
 * Core healing function that tries multiple locators in sequence.
 * @param {Page} page - The Playwright page object
 * @param {Object} options - Healing configuration
 * @param {string} options.primary - The primary selector to try first
 * @param {Array} options.fallbacks - Array of fallback selector configurations
 * @param {number} [options.timeout=2000] - Timeout in ms for each locator attempt
 * @param {boolean} [options.log=true] - Whether to enable logging
 * @returns {Locator} The first working locator found
 * @throws {Error} If no locators work
 */
async function regularHeal(page, options) {
  // Extract configuration options with default values
  const {
    primary,        // The main selector to try
    fallbacks = [], // Additional selectors to try if primary fails
    timeout = 2000, // How long to wait for each selector
    log: enableLog = true // Whether to show progress logs
  } = options;

  // Create an array of all locator attempts, starting with the primary
  // Automatically detect if primary is CSS or XPath
  const attempts = [
    { type: detectSelectorType(primary), value: primary },
    ...fallbacks // Add all fallback locators
  ];

  // Try each locator in order until one works
  for (let attempt of attempts) {
    try {
      // Log which locator we're trying
      log(`Trying: ${JSON.stringify(attempt)}`, enableLog);

      // Convert the locator configuration to a Playwright locator
      const locator = resolveLocator(page, attempt);

      // Wait for the element to be visible (this will throw if not found/visible)
      await locator.waitFor({
        state: 'visible',
        timeout
      });

      // Success! Log and return the working locator
      log(`✅ Success`, enableLog);

      return locator;

    } catch (err) {
      // This locator failed, log the failure and try the next one
      log(`❌ Failed`, enableLog);
    }
  }

  // All locators failed, throw an error with details
  throw new Error('Regular mode failed: All locators failed');
}

// Export the main healing function
export { regularHeal };