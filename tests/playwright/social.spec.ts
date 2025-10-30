import { test, expect } from '@playwright/test';

test.describe('Social Board', () => {
  test('create local post via composer', async ({ page }) => {
    // Seed user to skip auth
    await page.addInitScript(() => {
      window.localStorage.setItem('moodsync_user', JSON.stringify({ name: 'Tester', email: 'tester@example.com' }));
    });

    await page.goto('/');

    // Navigate to social via desktop nav first (fallback to mobile)
    const socialNav = page.getByTestId('nav-social');
    if (await socialNav.count()) {
      await socialNav.click();
    } else {
      const mobileSocial = page.getByTestId('mobile-nav-social');
      if (await mobileSocial.count()) await mobileSocial.click();
    }

    // Open composer
    const openComposer = page.getByTestId('open-composer');
    await openComposer.click();

    // Select mood and fill text
    const moodGreat = page.getByTestId('composer-mood-great');
    await moodGreat.click();
    const textArea = page.getByTestId('composer-text');
    await textArea.fill('Automation test post');

    // Submit
    const submitBtn = page.getByTestId('composer-submit');
    await submitBtn.click();

    // Assert post appears (look for text)
    await expect(page.getByText('Automation test post')).toBeVisible();
  });
});