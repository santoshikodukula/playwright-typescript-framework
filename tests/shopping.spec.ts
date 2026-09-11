import { test, expect } from "@playwright/test";
import { InventoryPage } from "../pages/InventoryPage";


test("user can add an item to the cart", {tag: "@smoke"}, async ({page}) => {

    const inventoryPage = new InventoryPage(page);
    await inventoryPage.goto();
    await inventoryPage.addFirstItemToCart();
    await expect(inventoryPage.cartBadge).toHaveText("1");

});


test("user can complete a checkout", {tag: ["@regression","@smoke"]},async ({page}) => {

    const inventoryPage = new InventoryPage(page);
    await inventoryPage.goto();
    await inventoryPage.addFirstItemToCart();
    await expect(inventoryPage.cartBadge).toHaveText("1");
    await inventoryPage.openCart();
    await inventoryPage.checkout();
    await inventoryPage.userDetails("Test", "User", "12345");
    await inventoryPage.continue();
    await inventoryPage.finish();
    await expect(inventoryPage.page.getByText("Thank you for your order!")).toBeVisible();
});
