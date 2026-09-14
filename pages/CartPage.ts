import {Page, Locator} from "@playwright/test";


export class CartPage {
    readonly page: Page;
    readonly checkoutButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.checkoutButton = page.getByRole("button", {name: "Checkout"});
    }

    async goto() {
        await this.page.goto("https://www.saucedemo.com/cart.html");
    }

    async clickCheckout() {
        await this.checkoutButton.click();
    }
}
