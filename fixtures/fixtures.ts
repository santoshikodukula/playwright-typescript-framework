import { test as base, expect, Page } from "@playwright/test";

export const test = base.extend<{ inventoryPage: Page, loginPage: Page }>({
    inventoryPage: async ({ page }, use) => {
        await page.goto("https://www.saucedemo.com/inventory.html");
        await use(page);
    },
    loginPage: async ({ page }, use) => {
        await page.goto("https://www.saucedemo.com");
        await use(page);
    }
});


export { expect };
