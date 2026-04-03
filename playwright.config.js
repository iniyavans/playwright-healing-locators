// TypeScript type checking for this config file
// @ts-check

// Import Playwright's configuration helper and device presets
import { defineConfig, devices } from '@playwright/test';

/**
 * Optional: Read environment variables from a .env file.
 * Uncomment the lines below if you want to use environment variables.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * Playwright test configuration
 * This file configures how Playwright runs your tests.
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  // Directory where test files are located
  testDir: './tests',

  /* Run tests in files in parallel for faster execution */
  fullyParallel: true,

  /* Fail the build on CI if you accidentally left test.only in the source code.
     This prevents focused tests from being committed to CI. */
  forbidOnly: !!process.env.CI,

  /* Retry failed tests: only retry on CI, not locally */
  retries: process.env.CI ? 2 : 0,

  /* Limit workers on CI to avoid resource conflicts.
     Locally, use undefined to let Playwright decide. */
  workers: process.env.CI ? 1 : undefined,

  /* Reporter to use: 'html' generates a visual report */
  reporter: 'html',

  /* Shared settings for all test projects */
  use: {
    /* Base URL to use in actions like `await page.goto('')`.
       Uncomment and set if all tests use the same domain. */
    // baseURL: 'http://localhost:3000',

    /* Collect trace when retrying the failed test.
       Traces help debug failures. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },

  /* Configure projects for different browsers */
  projects: [
    {
      // Test configuration for Google Chrome desktop browser
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    // {
    //   // Test configuration for Mozilla Firefox desktop browser
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },

    // {
    //   // Test configuration for Apple Safari desktop browser
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests.
     Uncomment and configure if you need to start a local server for testing. */
  // webServer: {
  //   command: 'npm run start',           // Command to start the server
  //   url: 'http://localhost:3000',       // URL to wait for before running tests
  //   reuseExistingServer: !process.env.CI, // Reuse server if already running (not on CI)
  // },
});

