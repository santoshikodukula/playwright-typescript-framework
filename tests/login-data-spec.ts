import { test, expect } from "@playwright/test";
import cases from "../tests/data/login-cases.json";

test.use({ storageState: { cookies: [], origins: [] } });

interface LoginCase {
    username: string;
    password: string;
    expected: string;
}



for (const testcases of cases) {
    test(`login as ${testcases.username}`, async ({page}) => {
        await page.goto("https://www.saucedemo.com");
        await page.getByPlaceholder("Username").fill(testcases.username);
        await page.getByPlaceholder("Password").fill(testcases.password);
        await page.getByRole("button", {name: "Login"}).click();
        await expect(page.getByText(testcases.expected)).toBeVisible();
    });
}
