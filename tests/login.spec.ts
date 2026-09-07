import { test, expect } from "@playwright/test";
test("valid user can log in", async ({page}) => {
    await page.goto("https://www.saucedemo.com");
    await page.getByPlaceholder("Username").fill("standard_user");
    await page.getByPlaceholder("Password").fill("secret_sauce");
    await page.getByRole("button",{name: "Login"}).click();
    await expect(page.getByText("Products")).toBeVisible();
});


test("locked out user sees an error", async ({page}) => {

    await page.goto("https://www.saucedemo.com");
    await page.getByPlaceholder("Username").fill("locked_out_user");
    await page.getByPlaceholder("Password").fill("secret_sauce");
    await page.getByRole("button", {name: "Login"}).click();
    await expect(page.getByText("Epic sadface: Sorry, this user has been locked out.")).toBeVisible();

});


test("user can add an item to the cart", async ({page}) => {

    await page.goto("https://www.saucedemo.com");
    await page.getByPlaceholder("Username").fill("standard_user");
    await page.getByPlaceholder("Password").fill("secret_sauce");
    await page.getByRole("button",{name: "Login"}).click();
    await expect(page.getByText("Products")).toBeVisible();
    await page.getByRole("button", {name: "Add to cart"}).first().click();
    await expect(page.getByTestId("shopping-cart-badge")).toHaveText("1");

});


test("user can complete a checkout", async ({page}) => {

    await page.goto("https://www.saucedemo.com");
    await page.getByPlaceholder("Username").fill("standard_user");
    await page.getByPlaceholder("Password").fill("secret_sauce");
    await page.getByRole("button", {name: "Login"}).click();
    await expect(page.getByText("Products")).toBeVisible();
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
