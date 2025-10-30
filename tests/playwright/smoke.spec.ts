import { test, expect } from '@playwright/test';

// Basic smoke test: ensures initial login screen appears, then simulates a fake login flow by mocking api.

test.describe('MoodSync Smoke', () => {
  test('shows login screen and navigates after mock login', async ({ page }) => {
    // Intercept API token retrieval if used
    await page.route(/.*createMoodEntry.*/, route => route.fulfill({ status: 200, body: JSON.stringify({ entry: { id: '1', mood: 'good', note: 'test', timestamp: new Date().toISOString(), intensity: 4 } }) }));

    await page.goto('http://localhost:3000/');

    // Expect login elements (adjust selectors to actual component markup) - placeholder text matching
    const loginHeading = page.locator('text=Login');
    await expect(loginHeading).toBeVisible({ timeout: 10000 });

    // If login requires inputs, fill them (adjust based on actual UI)
    const nameInput = page.locator('input[name="name"]');
    const emailInput = page.locator('input[name="email"]');
    if (await nameInput.count()) {
      await nameInput.fill('Test User');
    }
    if (await emailInput.count()) {
      await emailInput.fill('test@example.com');
    }

    // Click login button if present
    const loginButton = page.locator('button:has-text("Login")');
    if (await loginButton.count()) {
      await loginButton.click();
    }

    // After mock login, dashboard should show (look for a streak or mood tracker element) - adjust selector
    const dashboardMarker = page.locator('text=Mood logged').first();
    // We won't actually log a mood yet; instead verify some known dashboard element
    await expect(page.locator('text=Dashboard')).toBeVisible({ timeout: 15000 });
  });
});
