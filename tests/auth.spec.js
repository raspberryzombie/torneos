import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:5173';

test.describe('Auth Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
  });

  test('TC01 - Login exitoso con credenciales válidas', async ({ page }) => {
    await page.fill('[data-testid="login-email"]', 'juan@test.com');
    await page.fill('[data-testid="login-password"]', 'password123');
    await page.click('[data-testid="login-submit"]');

    await expect(page).toHaveURL(`${BASE_URL}/`);
    await expect(page.locator('h1')).toContainText('Hola, Juan');
  });

  test('TC02 - Login fallido con credenciales inválidas', async ({ page }) => {
    await page.fill('[data-testid="login-email"]', 'invalid@test.com');
    await page.fill('[data-testid="login-password"]', 'wrongpassword');
    await page.click('[data-testid="login-submit"]');

    await expect(page.locator('.auth-error')).toBeVisible();
    await expect(page.locator('.auth-error')).toContainText('Email o contraseña incorrectos');
  });

  test('TC04 - Logout', async ({ page }) => {
    await page.fill('[data-testid="login-email"]', 'juan@test.com');
    await page.fill('[data-testid="login-password"]', 'password123');
    await page.click('[data-testid="login-submit"]');

    await expect(page).toHaveURL(`${BASE_URL}/`);
    await page.click('[data-testid="profile-logout"]');
    await expect(page).toHaveURL(`${BASE_URL}/login`);
  });
});