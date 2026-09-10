import { test, expect } from "@playwright/test";


test("user can add an item to the cart", async ({page}) => {

    await page.goto("https://www.saucedemo.com/inventory.html");
    await page.getByRole("button", {name: "Add to cart"}).first().click();
    await expect(page.getByTestId("shopping-cart-badge")).toHaveText("1");

});


test("user can complete a checkout", async ({page}) => {

    await page.goto("https://www.saucedemo.com/inventory.html");
    await page.getByRole("button", {name: "Add to cart"}).first().click();
    await expect (page.getByTestId("shopping-cart-badge")).toHaveText("1");
    await page.getByTestId('shopping-cart-link').click();
    await page.getByRole("button", {name: "Checkout"}).click();
    await page.getByPlaceholder("First Name").fill("Test");
    await page.getByPlaceholder("Last Name").fill("User");
    await page.getByPlaceholder("Zip/Postal Code").fill("12345");
    await page.getByRole("button", {name: "Continue"}).click();
    await page.getByRole("button", {name: "Finish"}).click();
    await expect(page.getByText("Thank you for your order!")).toBeVisible();
});
