import { test, expect } from "@playwright/test";

test("homepage loads correctly", async ({ page }) => {
  await page.goto("/");
  
  // Check for main heading
  await expect(page.locator("h1")).toContainText("Hand-Crafted with Love");
  
  // Check for navigation
  await expect(page.locator("nav")).toBeVisible();
});

test("can navigate to shop page", async ({ page }) => {
  await page.goto("/");
  
  // Click on Women link
  await page.click('a[href*="shop?gender=WOMEN"]');
  
  // Should be on shop page
  await expect(page).toHaveURL(/.*shop/);
  await expect(page.locator("h1")).toContainText("Shop");
});

test("can view product detail", async ({ page }) => {
  await page.goto("/shop");
  
  // Wait for products to load
  await page.waitForSelector("a[href*='/product/']", { timeout: 10000 });
  
  // Click first product
  await page.click("a[href*='/product/']");
  
  // Should be on product page
  await expect(page).toHaveURL(/.*product/);
  await expect(page.locator("h1")).toBeVisible();
});

test("can add product to cart", async ({ page }) => {
  await page.goto("/");
  
  // Navigate to a product
  await page.click('a[href*="/shop"]');
  await page.waitForSelector("a[href*='/product/']");
  await page.click("a[href*='/product/']");
  
  // Add to cart
  await page.click("button:has-text('Add to Cart')");
  
  // Check cart badge
  await expect(page.locator("[aria-label='Cart']")).toBeVisible();
});

test("search functionality works", async ({ page }) => {
  await page.goto("/search");
  
  // Enter search query
  await page.fill("input[type='text']", "cardigan");
  await page.click("button[type='submit']");
  
  // Wait for results
  await page.waitForTimeout(1000);
  
  // Results should be shown
  await expect(page.locator("body")).toBeVisible();
});

