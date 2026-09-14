import {Page, Locator } from "@playwright/test";

export class CheckoutPage {
    readonly page: Page;
    readonly firstNameInput: Locator;
    readonly lastNameInput: Locator;
    readonly postalCodeInput: Locator;
    readonly continueButton: Locator;
    readonly finishButton: Locator;
    readonly confirmationMessage: Locator;

    constructor(page: Page) {
        this.page = page;
        this.firstNameInput = page.getByPlaceholder("First Name");
        this.lastNameInput = page.getByPlaceholder("Last Name");
        this.postalCodeInput = page.getByPlaceholder("Zip/Postal Code");
        this.continueButton = page.getByRole("button", {name: "Continue"});
        this.finishButton = page.getByRole("button", {name: "Finish"});
        this.confirmationMessage = page.locator('[data-test="complete-header"]');
    }

    async goto() {
        await this.page.goto("/checkout-step-one.html");   //it's a legitimate entry point: a test focusing on checkout form validation could jump straight there instead of walking the whole journey
    }

    async fillUserDetails(firstName: string, lastName: string, postalCode: string) {
        await this.firstNameInput.fill(firstName);
        await this.lastNameInput.fill(lastName);
        await this.postalCodeInput.fill(postalCode);
    }

    async clickContinue() {
        await this.continueButton.click();
    }

    async clickFinish() {
        await this.finishButton.click();
    }
}
