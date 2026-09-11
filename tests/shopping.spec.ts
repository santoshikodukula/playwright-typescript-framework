import { test, expect } from "../fixtures/fixtures";


test("user can add an item to the cart", {tag: "@smoke"}, async ({inventoryPage}) => {

    await inventoryPage.getByRole("button", {name: "Add to cart"}).first().click();
    await expect(inventoryPage.getByTestId("shopping-cart-badge")).toHaveText("1");

});


test("user can complete a checkout", {tag: ["@regression","@smoke"]},async ({inventoryPage}) => {

    await inventoryPage.getByRole("button", {name: "Add to cart"}).first().click();
    await expect (inventoryPage.getByTestId("shopping-cart-badge")).toHaveText("1");
    await inventoryPage.getByTestId('shopping-cart-link').click();
    await inventoryPage.getByRole("button", {name: "Checkout"}).click();
    await inventoryPage.getByPlaceholder("First Name").fill("Test");
    await inventoryPage.getByPlaceholder("Last Name").fill("User");
    await inventoryPage.getByPlaceholder("Zip/Postal Code").fill("12345");
    await inventoryPage.getByRole("button", {name: "Continue"}).click();
    await inventoryPage.getByRole("button", {name: "Finish"}).click();
    await expect(inventoryPage.getByText("Thank you for your order!")).toBeVisible();
});
