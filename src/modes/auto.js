/**
 * Auto-Healing Mode Module
 * This module provides intelligent, automatic healing for Playwright locators.
 * When a selector fails, it analyzes the selector to extract keywords and finds
 * similar elements on the page that might be the intended target.
 */

// Import the core healing function for basic locator resolution
import { regularHeal } from '../core/healer.js';
// Import functions for keyword extraction and candidate finding
import { extractKeywords, findCandidates } from '../core/autoHeal.js';
// Import logging utility for debugging and progress tracking
import { log } from '../core/logger.js';

/**
 * Core auto-healing logic that tries to find a working locator automatically.
 * @param {Page} page - The Playwright page object
 * @param {Object} options - Configuration object
 * @param {string} options.primary - The failed selector to analyze
 * @param {number} [options.timeout=2000] - Timeout for element waiting
 * @param {boolean} [options.log=true] - Whether to log healing process
 * @param {string} [action='click'] - The intended action ('click' or 'fill') to optimize candidate search
 * @returns {Locator} A working Playwright locator
 * @throws {Error} If no suitable element can be found
 */
async function autoHealLocator(page, options, action = 'click') {
  try {
    // First, try the primary locator without any fallbacks
    return await regularHeal(page, { ...options, fallbacks: [] });

  } catch (err) {
    // Primary locator failed, start auto-healing process
    log('🤖 Auto-healing started...', options.log);

    // Extract meaningful keywords from the failed selector
    const keywords = extractKeywords(options.primary);
    log(`Keywords: ${keywords.join(', ')}`, options.log);

    // Find potential matching elements based on the keywords
    const candidates = await findCandidates(page, keywords, action);

    // Try the top candidates (limited to 4 attempts to avoid too many tries)
    for (let i = 0; i < candidates.length; i++) {
      if (i > 3) break; // Limit attempts to prevent excessive waiting

      try {
        const el = candidates[i];

        // Wait for the candidate element to be visible
        await el.waitFor({
          state: 'visible',
          timeout: 2000
        });

        // Success! Log and return the working element
        log(`✅ Auto-healed using candidate ${i + 1}`, options.log);

        return el;

      } catch (e) {
        // This candidate didn't work, try the next one
        log(`❌ Candidate ${i + 1} failed`, options.log);
      }
    }

    // All candidates failed, throw an error
    throw new Error('Auto-healing failed: No suitable element found');
  }
}

/**
 * Performs a click action using auto-healing strategy.
 * @param {Page} page - The Playwright page object
 * @param {Object} options - Configuration object with primary selector
 */
async function click(page, options) {
  const locator = await autoHealLocator(page, options, 'click');
  await locator.click();
}

/**
 * Performs a fill action using auto-healing strategy.
 * @param {Page} page - The Playwright page object
 * @param {Object} options - Configuration object with primary selector
 * @param {string} options.primary - The selector to try (will auto-heal if it fails)
 * @param {number} [options.timeout=2000] - Timeout for element waiting
 * @param {boolean} [options.log=true] - Whether to log the healing process
 * @param {string} value - The text value to fill into the input field
 */
async function fill(page, options, value) {
  // Use the auto-healing locator function with 'fill' action for optimization
  const locator = await autoHealLocator(page, options, 'fill');
  // Fill the input field with the provided value
  await locator.fill(value);
}

// Export the functions for use in other modules
export { click, fill };