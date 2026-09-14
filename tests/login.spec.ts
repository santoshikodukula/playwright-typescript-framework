import { test , expect } from "../fixtures/fixtures";

test.use({ storageState: { cookies: [], origins: [] } });

test("valid user can log in", async ({ loginPage, inventoryPage }) => {
    await loginPage.goto();
    await loginPage.loginAs("standard_user", "secret_sauce");
    await expect(inventoryPage.pageTitle).toHaveText("Products");
});


test("locked out user sees an error", async ({loginPage}) => {

    await loginPage.goto();
    await loginPage.loginAs("locked_out_user", "secret_sauce");
    await expect(loginPage.errorMessage).toBeVisible();

});
