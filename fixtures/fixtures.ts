import { test as base, expect, Page } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { InventoryPage } from "../pages/InventoryPage";
import { CartPage } from "../pages/CartPage";
import { CheckoutPage } from "../pages/CheckoutPage";

export const test = base.extend<{ inventoryPage: InventoryPage, loginPage: LoginPage, cartPage: CartPage, checkoutPage: CheckoutPage }>({
    inventoryPage: async ({ page }, use) => {
        await use(new InventoryPage(page));
    },
    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page));
    },
    cartPage: async ({ page }, use) => {
        await use(new CartPage(page));
    },
    checkoutPage: async ({ page }, use) => {
        await use(new CheckoutPage(page));
    }
});

export { expect };
