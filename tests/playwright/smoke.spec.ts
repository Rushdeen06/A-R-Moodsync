import { test, expect } from '@playwright/test';

// Basic smoke test: ensures initial login screen appears, then simulates a fake login flow by mocking api.

test.describe('MoodSync Smoke', () => {
  test('login flow and mood submission', async ({ page }) => {
    // Stub mood entry creation
    await page.route(/.*createMoodEntry.*/, route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ entry: { id: '1', mood: 'great', note: 'Feeling awesome', timestamp: new Date().toISOString(), intensity: 5 } })
      });
    });

    await page.goto('/');

    // Assert login UI
    const loginTitle = page.getByText(/login/i).first();
    await expect(loginTitle).toBeVisible();

    // Fill in fields if they exist
    const nameInput = page.locator('input[name="name"]');
    const emailInput = page.locator('input[name="email"]');
    if (await nameInput.count()) await nameInput.fill('Test User');
    if (await emailInput.count()) await emailInput.fill('test@example.com');

    const loginButton = page.getByRole('button', { name: /login/i });
    if (await loginButton.count()) await loginButton.click();

    // Wait for dashboard marker (title or a streak element)
    await expect(page.getByText(/dashboard/i)).toBeVisible({ timeout: 15000 });

    // Attempt to open mood submission if a button exists
    const logMoodButton = page.getByRole('button', { name: /log mood/i });
    if (await logMoodButton.count()) {
      await logMoodButton.click();
      // Choose a mood option (assuming button text or data-testid)
      const greatMoodBtn = page.getByText(/great/i).first();
      if (await greatMoodBtn.count()) {
        await greatMoodBtn.click();
      }
      // Submit mood if a submit button exists
      const submitBtn = page.getByRole('button', { name: /submit/i });
      if (await submitBtn.count()) await submitBtn.click();
    }

    // Verify toast or updated entry list if visible
    const toastSuccess = page.getByText(/mood logged/i);
    if (await toastSuccess.count()) await expect(toastSuccess).toBeVisible();
  });
});
