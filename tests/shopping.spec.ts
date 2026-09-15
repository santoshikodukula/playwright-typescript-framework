import {test, expect} from "../fixtures/fixtures";



test("user can add an item to the cart", {tag: "@smoke"}, async ({ inventoryPage}) => {

    await inventoryPage.goto();
    await inventoryPage.addFirstItemToCart("Sauce Labs Backpack");
    await expect(inventoryPage.cartBadge).toHaveText("1");

});


test("user can complete a checkout", async ({ inventoryPage, cartPage, checkoutPage, page }) => {

    await inventoryPage.goto();
    await inventoryPage.addFirstItemToCart("Sauce Labs Backpack");
    await expect(inventoryPage.cartBadge).toHaveText("1");
    await inventoryPage.openCart();
    await expect(page).toHaveURL(/cart.html/);
    await cartPage.clickCheckout();
    await expect(page).toHaveURL(/checkout-step-one\.html/);
    await checkoutPage.fillUserDetails("Test", "User", "12345");
    await checkoutPage.clickContinue();
    await expect(page).toHaveURL(/checkout-step-two\.html/);
    await checkoutPage.clickFinish();
    await expect(checkoutPage.confirmationMessage).toHaveText("Thank you for your order!");
});


test ("inventory page displays six products", async ({inventoryPage}) => {

    await inventoryPage.goto();
    const count = await inventoryPage.getProductCount();
    expect(count).toBe(6);
    await expect(inventoryPage.productItems).toHaveCount(6);
})
