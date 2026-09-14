import {test, expect} from "../fixtures/fixtures";



test("user can add an item to the cart", {tag: "@smoke"}, async ({page, inventoryPage}) => {

    await inventoryPage.goto();
    await inventoryPage.addFirstItemToCart();
    await expect(inventoryPage.cartBadge).toHaveText("1");

});


test("user can complete a checkout", async ({ inventoryPage, cartPage, checkoutPage }) => {

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


test ("inventory page displays six products", async ({inventoryPage}) => {

    await inventoryPage.goto();
    const count = await inventoryPage.getProductCount();
    expect(count).toBe(6);
    await expect(inventoryPage.productItems).toHaveCount(6);
})
