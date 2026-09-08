import {test, expect} from "@playwright/test";

test("Write a login test with the HIGHEST-priority locator available", async ({page}) => {

    await page.goto("https://the-internet.herokuapp.com/login");
    await page.getByLabel("Username").fill("tomsmith");
    await page.getByLabel("Password").fill("SuperSecretPassword!");
    await page.getByRole("button", {name: "Login"}).click();
    await expect(page.getByText("Welcome to the Secure Area. When you are done click logout below.")).toBeVisible();
    await page.getByRole("link", {name: "Logout"}).click();
    await expect(page.getByText(("You logged out of the secure area!"))).toBeVisible();
});


test("Cause the violation on purpose", async ({page}) => {

    await page.goto("https://the-internet.herokuapp.com/challenging_dom");
    await page.getByRole("link", {name: "edit"}).first().click();
    await page.getByRole("link", {name: "edit"}).nth(3).click();
    await page.getByRole("row").filter({hasText: "Iuvaret0"}).getByRole("link", {name: "edit"}).click();
    await expect(page.getByRole("link", {name: "edit"})).toHaveCount(10);
})


test("dynamic content appears after clicking start", async ({page}) => {

    await page.goto("https://the-internet.herokuapp.com/dynamic_loading/2");
    await page.getByRole("button", {name: "Start"}).click();
    await expect(page.getByText("Loading")).toBeVisible();
    await expect(page.getByText("Hello World!")).toBeVisible({timeout: 10000});
    //expect(await page.getByText("Hello World!").isVisible()).toBe(true);})
});

test("middle nested frame contains expected text", async ({page}) => {

    await page.goto("https://the-internet.herokuapp.com/nested_frames");
    await expect(page.frameLocator("frame[name='frame-top']").frameLocator("frame[name='frame-middle']").getByText("MIDDLE")).toBeVisible();

});

test("JS confirm without a handler", async ({page}) => {
    await page.goto("https://the-internet.herokuapp.com/javascript_alerts");

    // page.on("dialog", dialog => dialog.dismiss());              // → "You clicked: Cancel"
    //page.on("dialog", dialog => dialog.accept("my text"));      // for JS Prompt — passes input
    page.on("dialog", dialog => {
        console.log(dialog.message());
        dialog.accept();
    });
    await page.getByRole("button", {name: "Click for JS Confirm"}).click();
    await expect(page.locator("#result")).toHaveText("You clicked: Ok");
});


test("new tab opens with expected heading", async ({page,context}) => {

    await page.goto("https://the-internet.herokuapp.com/windows");
    const newPagePromise = context.waitForEvent("page");
    await page.getByRole("link", {name: "Click Here"}).click();
    const newPage = await newPagePromise;
    await expect(newPage.getByRole("heading", {name: "New Window"})).toBeVisible();
});
