import {test,expect} from '@playwright/test';



test ("Submitting the text box form displays the entered values", async ({ page })=> {

    await page.goto("https://demoqa.com/text-box");
    await page.getByPlaceholder("Full Name").fill("John Doe");
    await page.getByPlaceholder("name@example.com").fill("john.doe@example.com");
    await page.getByPlaceholder("Current Address").fill("123 Test Street");
    await page.getByRole("button", { name: "Submit" }).click();
    await expect(page.locator("#output #name")).toContainText("John Doe");
    await expect(page.locator("#output #email")).toContainText("john.doe@example.com");
    await expect(page.locator("#output #currentAddress")).toContainText("123 Test Street");
});


test ("Invalid email is rejected", async ({ page })=> {

    await page.goto("https://demoqa.com/text-box");
    await page.getByPlaceholder("Full Name").fill("Test User");
    await page.getByPlaceholder("name@example.com").fill("not-an-email");
    await page.getByPlaceholder("Current Address").fill("123 Test Street");
    await page.getByRole("button", { name: "Submit" }).click();
    await expect(page.locator("#userEmail")).toHaveClass(/field-error/);
    await expect(page.locator("#output")).not.toBeVisible();
});
