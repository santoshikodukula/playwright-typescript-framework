import {Page, Locator} from "@playwright/test";

export class InventoryPage {

    readonly page: Page;
    readonly cartBadge: Locator;
    readonly cartLink: Locator;
    readonly productItems: Locator;
    readonly productNames: Locator;
    readonly pageTitle: Locator;



    constructor(page: Page) {
        this.page = page;
        this.pageTitle = page.locator('[data-test="title"]');
        this.cartBadge = page.locator(".shopping_cart_badge");
        this.cartLink = page.locator(".shopping_cart_link");
        this.productItems = page.locator(".inventory_item");
        this.productNames= page.locator(".inventory_item_name");

    }

    async goto() {
        await this.page.goto("/inventory.html");
    }

    async addFirstItemToCart(productName: string) {
        await this.page.getByTestId("inventory-item")
            .filter({hasText: productName})
            .getByRole("button", {name: "Add to cart"})
            .click();
    }

    async openCart() {
        await this.cartLink.click();
    }

    async getProductCount(): Promise<number> {
        return await this.productItems.count();
    }

}
