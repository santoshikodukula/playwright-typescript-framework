import { test , expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";

test.use({ storageState: { cookies: [], origins: [] } });

test("valid user can log in", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.loginAs("standard_user", "secret_sauce");
    await expect(page.getByText("Products")).toBeVisible();
});


test("locked out user sees an error", async ({page}) => {

    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.loginAs("locked_out_user", "secret_sauce");
    await expect(loginPage.errorMessage).toBeVisible();

});
