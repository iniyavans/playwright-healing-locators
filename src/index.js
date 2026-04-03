/**
 * Main entry point for the Playwright Healing Locators library.
 * This library provides self-healing locator strategies for Playwright tests,
 * allowing tests to automatically find alternative selectors when the primary one fails.
 */

// Import the regular healing mode module, which provides fill and click methods with fallback support
import * as regular from './modes/regular.js';

// Import the auto-healing mode module, which provides intelligent self-healing without manual fallbacks
import * as auto from './modes/auto.js';

// Export the healing modules with descriptive names
// regularHeal: Use this for tests where you want to specify fallback locators manually
// autoHeal: Use this for tests where you want automatic healing based on element analysis
export { regular as regularHeal, auto as autoHeal };