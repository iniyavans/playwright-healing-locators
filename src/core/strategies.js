/**
 * Locator Strategies Module
 * This module handles different types of element selectors and converts them
 * to Playwright locators. It supports CSS, XPath, text, ARIA labels, and roles.
 */

/**
 * Detects the type of selector string (CSS or XPath).
 * @param {string} selector - The selector string to analyze
 * @returns {string} 'xpath' if it starts with '/' or '//', otherwise 'css'
 */
function detectSelectorType(selector) {
  // XPath selectors always start with '/' or '//'
  if (selector.startsWith('/') || selector.startsWith('//')) {
    return 'xpath';
  }
  // Default to CSS for all other selectors
  // Could be extended to detect other types like data-testid, etc.
  return 'css';
}

/**
 * Converts a strategy configuration to a Playwright locator.
 * @param {Page} page - The Playwright page object
 * @param {Object} strategy - The locator strategy configuration
 * @param {string} strategy.type - The type of locator ('css', 'xpath', 'text', 'aria', 'role')
 * @param {string} strategy.value - The selector value
 * @param {string} [strategy.name] - For role strategies, the accessible name
 * @returns {Locator} A Playwright locator object
 * @throws {Error} If the strategy type is not supported
 */
function resolveLocator(page, strategy) {
  // Use a switch statement to handle different locator types
  switch (strategy.type) {
    case 'css':
      // Standard CSS selector like '#id', '.class', 'input[type="text"]'
      return page.locator(strategy.value);

    case 'xpath':
      // XPath selector like '//input[@id="username"]'
      return page.locator(strategy.value);

    case 'text':
      // Find element by its visible text content
      return page.getByText(strategy.value);

    case 'aria':
      // Find element by its aria-label attribute
      return page.getByLabel(strategy.value);

    case 'role':
      // Find element by ARIA role and accessible name
      return page.getByRole(strategy.value, {
        name: strategy.name // The accessible name for the role
      });

    default:
      // Unknown strategy type, throw an error with details
      throw new Error(`Unsupported strategy: ${JSON.stringify(strategy)}`);
  }
}

// Export the functions for use in other modules
export { resolveLocator, detectSelectorType };