import {test, expect} from "@playwright/test";

test ("Login test", async ({page}) => {

    await page.goto("https://saucedemo.com/");
    await page.getByPlaceholder("Username").fill("standard_user");
    await page.getByPlaceholder("Password").fill("secret_sauce");
    await page.getByRole("button", {name: "Login"}).click();
    await expect(page.getByText("Products")).toBeVisible();
});

test ("Valid user can login", async ({ page })=> {

    await page.goto("https://the-internet.herokuapp.com/login");
    await page.getByLabel("Username").fill("tomsmith");
    await page.getByLabel("Password").fill("SuperSecretPassword!");
    await page.getByRole("button", { name: "Login" }).click();
    await expect(page.locator("#flash")).toContainText("You logged into a secure area!");
} );



