import {Page, Locator} from '@playwright/test';

export class SecureAreaPage {
    readonly page: Page;
    readonly flashMessage: Locator;
    readonly username: Locator;
    readonly password: Locator;
    readonly loginButton: Locator;
    readonly logoutButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.flashMessage = page.locator('#flash');
        this.username = page.getByLabel("Username");
        this.password = page.getByLabel("Password");
        this.loginButton = page.getByRole("button", {name: "Login"});
        this.logoutButton = page.getByRole("link", {name: "Logout"});
    }

    async goto() {
        await this.page.goto("/login");
    }

    async loginAs(username: string, password: string) {
        await this.username.fill(username);
        await this.password.fill(password);
        await this.loginButton.click();
    }

    async logout() {
        await this.logoutButton.click();
    }
}
