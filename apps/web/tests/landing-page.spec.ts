import { test, expect } from '@playwright/test';

test('landing page branding and pricing', async ({ page }) => {
  await page.goto('/en');

  // Verify Title
  await expect(page).toHaveTitle(/Trades-USA/);

  // Verify Header Branding
  const branding = page.locator('header').getByText('TRADES-USA');
  await expect(branding).toBeVisible();

  // Verify Hero Headlines
  await expect(page.getByText('We Build the Engine.')).toBeVisible();
  await expect(page.getByText('You Get the Leads.')).toBeVisible();

  // Verify Pricing Section
  const pricingSection = page.locator('#pricing');
  await pricingSection.scrollIntoViewIfNeeded();
  await expect(pricingSection).toBeVisible();

  // Verify Pricing Tiers
  await expect(page.getByRole('heading', { name: 'Community Free' })).toBeVisible({ timeout: 10000 });
  await expect(page.getByRole('heading', { name: 'Lead Starter' })).toBeVisible({ timeout: 10000 });
  await expect(page.getByRole('heading', { name: 'Lead Engine' })).toBeVisible({ timeout: 10000 });

  // Verify Prices
  await expect(page.getByText('$0')).toBeVisible();
  await expect(page.getByText('$149')).toBeVisible();
  await expect(page.getByText('$349')).toBeVisible();
});

test('navigation to booking page', async ({ page }) => {
  await page.goto('/en');
  
  // Click CTA in hero
  await page.getByRole('link', { name: 'Start Getting Leads' }).first().click();
  
  // Verify booking page
  await expect(page).toHaveURL(/\/en\/booking/);
  await expect(page.getByText('Let\'s Build Your Growth Engine')).toBeVisible();
});

test('navigation to auth page', async ({ page }) => {
  await page.goto('/en');
  
  // Click login in navbar
  await page.getByRole('link', { name: 'Login' }).first().click();
  
  // Verify auth page
  await expect(page).toHaveURL(/\/en\/auth/);
  await expect(page.getByText('Sign In', { exact: false }).first()).toBeVisible();
});
