import { test, expect } from '@playwright/test';

test.beforeEach(async ({page}) => {
  await page.goto('/');
})

test('dark mode button switches between light and dark mode', async ({ page }) => {
  await page.getByRole('button', { name: ' Dark Mode' }).click();
  await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(32, 44, 55)');
  await page.getByRole('button', { name: ' Dark Mode' }).click();
  await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(250, 250, 250)');
});
