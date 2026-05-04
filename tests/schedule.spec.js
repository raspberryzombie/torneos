import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:5173';

test.describe('Match Schedule', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await page.fill('[data-testid="login-email"]', 'juan@test.com');
    await page.fill('[data-testid="login-password"]', 'password123');
    await page.click('[data-testid="login-submit"]');
    await page.waitForURL(`${BASE_URL}/`);
  });

  test('TC09 - Ver partidos de hoy', async ({ page }) => {
    await expect(page.locator('h2:has-text("HOY")')).toBeVisible();
  });

  test('TC10 - Ver próximos 7 días', async ({ page }) => {
    await expect(page.locator('h2:has-text("PRÓXIMOS 7 DÍAS")')).toBeVisible();
  });

  test('TC11 - Ver mis torneos inscritos', async ({ page }) => {
    const myTournaments = page.locator('h2:has-text("MIS TORNEOS")');
    const isVisible = await myTournaments.isVisible();
    if (isVisible) {
      await expect(myTournaments).toBeVisible();
      await expect(page.locator('[class="registration-card"]')).toBeVisible();
    }
  });
});