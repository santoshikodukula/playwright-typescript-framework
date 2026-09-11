import {Page, Locator} from "@playwright/test";

export class InventoryPage {

    readonly page: Page;
    readonly cartBadge: Locator;
    readonly cartLink: Locator;
    readonly checkoutButton: Locator;
    readonly firstName: Locator;
    readonly lastName: Locator;
    readonly postalCode: Locator;
    readonly continueButton: Locator;
    readonly finishButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.cartBadge = page.locator(".shopping_cart_badge");
        this.cartLink = page.locator(".shopping_cart_link");
        this.checkoutButton = page.getByRole("button", {name: "Checkout"});
        this.firstName = page.getByPlaceholder("First Name");
        this.lastName = page.getByPlaceholder("Last Name");
        this.postalCode = page.getByPlaceholder("Zip/Postal Code");
        this.continueButton = page.getByRole("button", {name: "Continue"});
        this.finishButton = page.getByRole("button", {name: "Finish"});
    }

    async goto() {
        await this.page.goto("https://www.saucedemo.com/inventory.html");
    }

    async addFirstItemToCart() {
        const firstItemAddButton = this.page.locator(".inventory_item").first().locator("button");
        await firstItemAddButton.click();
    }

    async openCart() {
        await this.cartLink.click();
    }

    async checkout() {
        await this.checkoutButton.click();
    }

    async userDetails(firstName: string, lastName: string, postalCode: string) {
        await this.firstName.fill(firstName);
        await this.lastName.fill(lastName);
        await this.postalCode.fill(postalCode);
    }

    async continue() {
        await this.continueButton.click();
    }

    async finish() {
        await this.finishButton.click();
    }
}
