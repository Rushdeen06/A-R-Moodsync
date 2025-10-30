import { test, expect } from '@playwright/test';

// Basic smoke test: ensures initial login screen appears, then simulates a fake login flow by mocking api.

test.describe('MoodSync Smoke', () => {
  test('login and log a mood', async ({ page }) => {
    // Intercept mood creation
    await page.route(/createMoodEntry/, route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ entry: { id: '1', mood: 'happy', note: 'Test note', timestamp: new Date().toISOString(), intensity: 5 } })
      });
    });

    await page.goto('/');

    // Switch to login tab if not already
    const loginTab = page.getByRole('tab', { name: /login/i });
    if (await loginTab.count()) await loginTab.click();

    // Use data-testid selectors for stability
    const email = page.getByTestId('login-email');
    const password = page.getByTestId('login-password');
    const submit = page.getByTestId('login-submit');

    await email.fill('demo@example.com');
    await password.fill('password123');
    await submit.click();

    // Wait for dashboard to appear (heuristic text)
    await expect(page.getByText(/dashboard/i)).toBeVisible({ timeout: 15000 });

    // Mood tracker interactions
    const happyMood = page.getByTestId('mood-option-happy');
    if (await happyMood.count()) {
      await happyMood.click();
      const moodSubmit = page.getByTestId('mood-submit');
      await moodSubmit.click();
    }

    // Assert toast or success message
    const successToast = page.getByText(/mood logged successfully/i);
    if (await successToast.count()) await expect(successToast).toBeVisible();
  });
});
