import { test , expect } from "../fixtures/fixtures";


test.use({ storageState: { cookies: [], origins: [] } });

test("valid user can log in", async ({loginPage}) => {
    await loginPage.getByPlaceholder("Username").fill("standard_user");
    await loginPage.getByPlaceholder("Password").fill("secret_sauce");
    await loginPage.getByRole("button",{name: "Login"}).click();
    await expect(loginPage.getByText("Products")).toBeVisible();
});


test("locked out user sees an error", async ({loginPage}) => {

    await loginPage.getByPlaceholder("Username").fill("locked_out_user");
    await loginPage.getByPlaceholder("Password").fill("secret_sauce");
    await loginPage.getByRole("button", {name: "Login"}).click();
    await expect(loginPage.getByText("Epic sadface: Sorry, this user has been locked out.")).toBeVisible();

});
