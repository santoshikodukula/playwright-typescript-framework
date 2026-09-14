import {Page, Locator} from "@playwright/test";

export class InventoryPage {

    readonly page: Page;
    readonly cartBadge: Locator;
    readonly cartLink: Locator;


    constructor(page: Page) {
        this.page = page;
        this.cartBadge = page.locator(".shopping_cart_badge");
        this.cartLink = page.locator(".shopping_cart_link");

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
}
