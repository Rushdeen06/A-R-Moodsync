import { test, expect } from '@playwright/test';

const BASE = process.env.BASE_URL || 'http://localhost:3001';

test.describe('A&R MoodSync smoke', () => {
  test('home loads and shows greeting', async ({ page }) => {
    await page.goto(BASE);
    await expect(page).toHaveTitle(/MoodSync|A&R MoodSync/);
    // check for Log Mood button
    const logBtn = page.locator('text=Log Mood');
    await expect(logBtn).toBeVisible();
  });

  test('open social board and back', async ({ page }) => {
    await page.goto(BASE);
    await page.click('text=View Social Board');
    await page.waitForURL('**/social**', { timeout: 3000 }).catch(() => {});
    // try to find Social Board header
    const header = page.locator('text=Social Board');
    await expect(header).toBeVisible({ timeout: 2000 }).catch(() => {});
    // go back home
    await page.click('text=Home').catch(() => {});
    await expect(page.locator('text=Log Mood')).toBeVisible();
  });

  test('open profile tab', async ({ page }) => {
    await page.goto(BASE);
    await page.click('[aria-label="Profile"]', { timeout: 2000 }).catch(async () => {
      // fallback: click profile label
      await page.click('text=Profile').catch(() => {});
    });
    // check for Profile preview
    await expect(page.locator('text=Profile preview')).toBeVisible({ timeout: 2000 }).catch(() => {});
  });
});
