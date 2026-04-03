/**
 * Auto-Healing Utilities Module
 * This module contains functions for automatically finding alternative elements
 * when a selector fails. It extracts keywords from selectors and searches the DOM
 * for similar elements that might be the intended target.
 */

/**
 * Extracts meaningful keywords from a selector string for auto-healing.
 * Supports both CSS and XPath selectors by parsing them differently.
 * @param {string} selector - The CSS or XPath selector to analyze
 * @returns {string[]} Array of lowercase keywords extracted from the selector
 */
function extractKeywords(selector) {
  // Check if this is an XPath selector (starts with / or //)
  if (selector.startsWith('/') || selector.startsWith('//')) {
    // XPath parsing logic
    const keywords = [];

    // Extract tag names like 'input', 'button' from //tagName
    const tagMatch = selector.match(/\/\/(\w+)/);
    if (tagMatch) keywords.push(tagMatch[1]);

    // Extract attribute values like @id='username' -> 'username'
    const attrMatches = selector.match(/@[\w-]+='([^']+)'/g);
    if (attrMatches) {
      attrMatches.forEach(match => {
        const value = match.match(/'([^']+)'/)?.[1];
        if (value) keywords.push(value);
      });
    }

    // Extract text content like text()='Submit' -> 'Submit'
    const textMatch = selector.match(/text\(\)='([^']+)'/);
    if (textMatch) keywords.push(textMatch[1]);

    // Convert all keywords to lowercase for case-insensitive matching
    return keywords.map(word => word.toLowerCase());
  } else {
    // CSS parsing logic
    return selector
      .replace(/[#._-]/g, ' ')  // Replace special chars with spaces
      .split(' ')               // Split into words
      .filter(Boolean)          // Remove empty strings
      .map(word => word.toLowerCase()); // Convert to lowercase
  }
}

/**
 * Finds candidate elements in the DOM that match the extracted keywords.
 * Searches for elements likely to be interactive based on the intended action.
 * @param {Page} page - The Playwright page object
 * @param {string[]} keywords - Keywords extracted from the failed selector
 * @param {string} [action='click'] - The intended action ('click' or 'fill') to optimize search
 * @returns {Locator[]} Array of candidate element locators, sorted by relevance
 */
async function findCandidates(page, keywords, action = 'click') {
  let selector;

  // Choose different element types based on the intended action
  if (action === 'fill') {
    // For filling, look for input elements that can receive text
    selector = 'input, textarea, select';
  } else {
    // For clicking, look for clickable elements
    selector = 'button, a, input[type="button"], input[type="submit"]';
  }

  // Get all matching elements on the page
  const elements = await page.locator(selector).all();

  const matches = [];

  // Evaluate each element to see how well it matches our keywords
  for (const el of elements) {
    // Get the visible text content (if any)
    const text = (await el.innerText().catch(() => '')).toLowerCase();
    // Get the aria-label attribute (if any)
    const aria = (await el.getAttribute('aria-label') || '').toLowerCase();
    // Get the name attribute (common for form inputs)
    const name = (await el.getAttribute('name') || '').toLowerCase();
    // Get the id attribute
    const id = (await el.getAttribute('id') || '').toLowerCase();
    // Get the placeholder attribute (for inputs)
    const placeholder = (await el.getAttribute('placeholder') || '').toLowerCase();

    let score = 0; // Relevance score for this element

    // Check each keyword against various element properties
    for (const key of keywords) {
      if (text.includes(key)) score += 2;        // Text content is most important
      if (aria.includes(key)) score += 1;       // ARIA label is helpful
      if (name.includes(key)) score += 1;       // Name attribute
      if (id.includes(key)) score += 1;         // ID attribute
      if (placeholder.includes(key)) score += 1; // Placeholder text
    }

    // If the element has any matching keywords, add it to candidates
    if (score > 0) {
      matches.push({ el, score });
    }
  }

  // Sort candidates by score (highest first) and return just the elements
  matches.sort((a, b) => b.score - a.score);

  return matches.map(m => m.el);
}

// Export the functions for use in other modules
export { extractKeywords, findCandidates };