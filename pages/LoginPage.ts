import { Page, Locator} from '@playwright/test';

export class LoginPage {
    readonly page: Page;
    readonly  username: Locator;
    readonly password: Locator;
    readonly loginButton: Locator;
    readonly errorMessage: Locator;

    constructor(page: Page) {
        this.page = page;
        this.username = page.getByLabel("Username");
        this.password = page.getByLabel("Password");
        this.loginButton = page.getByRole("button", {name: "Login"});
        this.errorMessage = page.getByTestId("error");
    }

    async goto() {
        await this.page.goto("/");   //assuming the login page is the root
    }

    async loginAs(username: string, password: string) {
        await this.username.fill(username);
        await this.password.fill(password);
        await this.loginButton.click();
    }
}
