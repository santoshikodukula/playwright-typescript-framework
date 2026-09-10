import {test as setup, expect } from '@playwright/test';

const herokuappAuth = "playwright/.auth/user.json";
const saucedemoAuth = "playwright/.auth/saucedemo.json";

setup("authenticate on the herokuapp", async ({page}) => {

    await page.goto("https://the-internet.herokuapp.com/login");
    await page.getByLabel("Username").fill("tomsmith");
    await page.getByLabel("Password").fill("SuperSecretPassword!");
    await page.getByRole("button", { name: "Login" }).click();
    await expect(page.locator("#flash")).toContainText("secure area!");

    await page.context().storageState({path: herokuappAuth });
});

setup("authenticate on the saucedemo", async ({page}) => {

    await page.goto("https://www.saucedemo.com");
    await page.getByPlaceholder("Username").fill("standard_user");
    await page.getByPlaceholder("Password").fill("secret_sauce");
    await page.getByRole("button",{name: "Login"}).click();
    await expect(page.getByText("Products")).toBeVisible();

    await page.context().storageState({path: saucedemoAuth });

});
