import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:5173';

test.describe('Tournament Discovery', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await page.fill('[data-testid="login-email"]', 'juan@test.com');
    await page.fill('[data-testid="login-password"]', 'password123');
    await page.click('[data-testid="login-submit"]');
    await page.waitForURL(`${BASE_URL}/`);
  });

  test('TC05 - Ver lista de torneos', async ({ page }) => {
    await page.click('[data-testid="tournaments-nav"] >> text=Torneos');
    await page.waitForURL(`${BASE_URL}/tournaments`);
    await expect(page.locator('h1')).toContainText('Torneos');
  });

  test('TC05 - Ver lista de torneos con contenido', async ({ page }) => {
    await page.goto(`${BASE_URL}/tournaments`);
    await expect(page.locator('[data-testid="tournament-card-"]')).toBeVisible();
  });

  test('TC06 - Filtrar torneos por categoría', async ({ page }) => {
    await page.goto(`${BASE_URL}/tournaments`);
    await page.selectOption('[data-testid="filter-category"]', 'open');
    await page.waitForTimeout(500);
  });

  test('TC07 - Ver detalle de torneo', async ({ page }) => {
    await page.goto(`${BASE_URL}/tournaments`);
    const firstCard = page.locator('[class="tournament-card"]').first();
    await firstCard.click();
    await expect(page).toHaveURL(/\/tournaments\/.+/);
    await expect(page.locator('[data-testid="tournament-register"]')).toBeVisible();
  });

  test('TC08 - Inscribirse a torneo', async ({ page }) => {
    await page.goto(`${BASE_URL}/tournaments`);
    
    const cards = page.locator('[class="tournament-card"]');
    const count = await cards.count();
    
    if (count > 0) {
      await cards.first().click();
      await page.waitForURL(/\/tournaments\/.+/);
      
      const registerBtn = page.locator('[data-testid="tournament-register"]');
      if (await registerBtn.isVisible()) {
        await registerBtn.click();
        await page.waitForTimeout(500);
        await expect(page.locator('[data-testid="tournament-cancel-register"]')).toBeVisible();
      }
    }
  });
});