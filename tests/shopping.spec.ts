import {test, expect} from "@playwright/test";
import {InventoryPage} from "../pages/InventoryPage";
import {CheckoutPage} from "../pages/CheckoutPage";
import {CartPage} from "../pages/CartPage";


test("user can add an item to the cart", {tag: "@smoke"}, async ({page}) => {

    const inventoryPage = new InventoryPage(page);
    await inventoryPage.goto();
    await inventoryPage.addFirstItemToCart();
    await expect(inventoryPage.cartBadge).toHaveText("1");

});


test("user can complete a checkout", {tag: ["@regression", "@smoke"]}, async ({page}) => {

    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);
    await inventoryPage.goto();
    await inventoryPage.addFirstItemToCart();
    await expect(inventoryPage.cartBadge).toHaveText("1");
    await inventoryPage.openCart();
    await cartPage.clickCheckout();
    await checkoutPage.fillUserDetails("Test", "User", "12345");
    await checkoutPage.clickContinue();
    await checkoutPage.clickFinish();
    await expect(checkoutPage.confirmationMessage).toHaveText("Thank you for your order!");
});
