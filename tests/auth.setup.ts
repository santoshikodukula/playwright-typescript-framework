import {test as setup, expect } from '@playwright/test';

const authFile = "playwright/.auth/user.json";

setup("authenticate", async ({page}) => {

    await page.goto("https://the-internet.herokuapp.com/login");
    await page.getByLabel("Username").fill("tomsmith");
    await page.getByLabel("Password").fill("SuperSecretPassword!");
    await page.getByRole("button", { name: "Login" }).click();
    await expect(page.locator("#flash")).toContainText("secure area!");

    await page.context().storageState({path: authFile });
});

