import {test, expect} from "@playwright/test";
import {SecureAreaPage} from "../pages/SecureAreaPage";

test("valid credentials reach the secure area", async ({page}) => {

    const secureAreaPage = new SecureAreaPage(page);
    await secureAreaPage.goto();
    await secureAreaPage.loginAs("tomsmith", "SuperSecretPassword!");
    await expect(secureAreaPage.flashMessage).toContainText("You logged into a secure area!");

});

test("logging out returns to the login page", async ({page}) => {

    const secureAreaPage = new SecureAreaPage(page);
    await secureAreaPage.goto();
    await secureAreaPage.loginAs("tomsmith", "SuperSecretPassword!");
    await secureAreaPage.logout();
    await expect(secureAreaPage.flashMessage).toContainText("You logged out");

});
