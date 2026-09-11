import { test as base, expect, Page } from "@playwright/test";

export const test = base.extend<{ inventoryPage: Page }>({
    inventoryPage: async ({ page }, use) => {
        await page.goto("https://www.saucedemo.com/inventory.html");
        await use(page);
    },
});

export { expect };
