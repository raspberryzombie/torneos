import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:5173';

test.describe('Profile', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await page.fill('[data-testid="login-email"]', 'juan@test.com');
    await page.fill('[data-testid="login-password"]', 'password123');
    await page.click('[data-testid="login-submit"]');
    await page.waitForURL(`${BASE_URL}/`);
  });

  test('TC14 - Editar perfil', async ({ page }) => {
    await page.click('[data-testid="profile-nav"] >> text=Perfil');
    await page.waitForURL(`${BASE_URL}/profile`);
    
    const nameInput = page.locator('[data-testid="profile-name"]');
    await nameInput.clear();
    await nameInput.fill('Juan Actualizado');
    
    await page.click('[data-testid="level-7"]');
    
    await page.click('[data-testid="profile-save"]');
    
    await expect(page.locator('.success-message')).toBeVisible();
    await expect(page.locator('.success-message')).toContainText('Cambios guardados');
  });
});