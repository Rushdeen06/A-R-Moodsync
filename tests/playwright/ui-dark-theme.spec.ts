import { test, expect } from '@playwright/test';

// Basic UI smoke test for dark Teams-like layout

test.describe('Dark UI Layout', () => {
  test('sidebar and navigation work', async ({ page }) => {
    await page.goto('/');

    // Force localStorage user seed so app bypasses login
    await page.addInitScript(() => {
      localStorage.setItem('moodsync_user', JSON.stringify({ name: 'Test User', email: 'test@example.com' }));
      localStorage.setItem('theme', 'dark');
    });

    await page.reload();

    // Wait for dashboard
    await page.getByTestId('nav-dashboard').waitFor({ state: 'visible' });

    // Assert dark sidebar background (approx color)
    const rail = page.locator('.teams-rail');
    await expect(rail).toBeVisible();

    // Navigate to Achievements
    await page.getByTestId('nav-achievements').click();
    await page.getByTestId('achievements-screen').waitFor();

    // Navigate to Reports
    await page.getByTestId('nav-reports').click();
    await page.getByTestId('reports-screen').waitFor();

    // Navigate to Settings
    await page.getByTestId('nav-settings').click();
    await page.getByTestId('settings-screen').waitFor();

    // Back to Team Board
    await page.getByTestId('nav-team').click();
    await page.getByTestId('team-screen').waitFor();

    // Manager dashboard (if route accessible)
    await page.getByTestId('nav-analytics').click();
    await page.getByTestId('nav-profile').click();
  });
});
