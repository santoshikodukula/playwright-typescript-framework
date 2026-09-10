import {test,expect} from '@playwright/test';


test ("Expanding the tree reveals child nodes", async ({ page}) => {

    await page.goto("https://demoqa.com/checkbox");
    await page.locator(".rc-tree-switcher").first().click();
    await expect(page.getByRole("treeitem", { name: "Desktop" })).toBeVisible();
    await expect(page.getByRole("treeitem", { name: "Documents" })).toBeVisible();
    await expect(page.getByRole("treeitem", { name: "Downloads" })).toBeVisible();
});


test ("selecting an option from the old style menu updates the value", async ({ page}) => {

    await page.goto("https://demoqa.com/select-menu");
    await page.locator("#oldSelectMenu").selectOption("4");
    await expect(page.locator("#oldSelectMenu")).toHaveValue("4");
});

test ("double click and right click produce their messages", async ({ page}) => {

    await page.goto("https://demoqa.com/buttons");
    await page.getByRole("button", {name: "Double Click Me"}).dblclick();
    await page.getByRole("button", {name: "Right Click Me"}).click({button: "right"});
    await expect(page.locator(("#doubleClickMessage"))).toHaveText("You have done a double click");
    await expect(page.locator(("#rightClickMessage"))).toHaveText("You have done a right click");
});
