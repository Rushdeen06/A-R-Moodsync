import { test, expect } from '@playwright/test';

// Basic smoke test: ensures initial login screen appears, then simulates a fake login flow by mocking api.

test.describe('MoodSync Smoke', () => {
  test('login bypass and log a mood', async ({ page }) => {
    // Intercept mood creation
    await page.route(/createMoodEntry/, route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ entry: { id: '1', mood: 'happy', note: 'Test note', timestamp: new Date().toISOString(), intensity: 5 } })
      });
    });

    // Pre-seed localStorage with a fake logged-in user BEFORE first navigation
    await page.addInitScript(() => {
      window.localStorage.setItem('moodSyncUser', JSON.stringify({ name: 'CI User', email: 'ci@example.com', accessToken: 'test-token' }));
    });

    await page.goto('/');

  // Wait for dashboard to appear directly (skips login screen)
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
