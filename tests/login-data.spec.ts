import cases from "../tests/data/login-cases.json";
import { test, expect } from "@playwright/test";

test.use({ storageState: { cookies: [], origins: [] } });

interface LoginCase {
    username: string;
    password: string;
    expected: string;
}


const testCases: LoginCase[] = cases;        // ← this line connects them

for (const testcases of testCases) {
    test(`login as ${testcases.username}`, async ({page}) => {
        await page.goto("/");
        await page.getByPlaceholder("Username").fill(testcases.username);
        await page.getByPlaceholder("Password").fill(testcases.password);
        await page.getByRole("button", {name: "Login"}).click();
        await expect(page.getByText(testcases.expected)).toBeVisible();
    });
}
