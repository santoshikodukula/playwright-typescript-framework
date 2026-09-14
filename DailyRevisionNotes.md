# Quick Revision Notes — TypeScript & Playwright

## Topics Covered

**TypeScript:** 1. Variables & types · 2. Functions & arrow functions · 3. Interfaces & objects · 4. Async/await · 5. Arrays & loops · 6. String methods · 7. Imports & exports

**Playwright:** 8. Test anatomy & setup · 9. Locators & priority order · 10. Strict mode · 11. Auto-waiting & assertions · 12. iframes, dialogs, tabs · 13. storageState authentication · 14. Fixtures · 15. Data-driven tests · 16. Tags · 17. Page Object Model

---

## 1. Variables & Types

```typescript
const baseUrl: string = "https://myapp.com";   // locked
let count: number = 0;                          // changes
count = 1;                                       // reassign: no let, no type
const isPassed: boolean = false;
```
- Numbers have no quotes · types are lowercase (`string` not `String`)
- Reassigning a `const` → *"Cannot assign to X because it is a constant"*

## 2. Functions & Arrow Functions

```typescript
const addToCart = (item: string, qty: number): string => {
  return `Added ${qty} x ${item} to cart`;
};
console.log(addToCart("Backpack", 2));
```
- **Backticks** for `${injection}` — normal quotes print `${x}` literally
- Parameters ARE declarations — no outer variables needed
- Values fill parameters **by position** — swapping same-typed args compiles but breaks
- `fn` references · `fn("x")` executes

## 3. Interfaces & Objects

```typescript
interface TestUser {
  username: string;
  passed: boolean;
}

const user: TestUser = { username: "standard_user", passed: true };

const report = (u: TestUser): string => `${u.username} -> ${u.passed}`;
```
- Interface = template (no data, runs silently) · object = filled form · dot = read a field
- Fields match **by name** — order irrelevant
- Missing field → *"Property 'X' is missing in type ... but required"*
- One template serves many objects: `const a: TestUser`, `const b: TestUser`

## 4. Async/Await

```typescript
const loadPage = (url: string): Promise<string> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(`Loaded: ${url}`), 2000);
  });
};

const runTest = async (): Promise<void> => {
  const result = await loadPage("https://myapp.com");   // pauses here
  console.log(result);
};
runTest();
```
- `await` = pause until the slow operation returns its **real result**
- No `await` → you get `Promise { <pending> }` (an IOU) and code races ahead
- `await` only works inside an `async` function
- Two async calls without awaits between them run **concurrently** (logs interleave)

## 5. Arrays & Loops

```typescript
const order: OrderLine[] = [
  { item: "Apple", qty: 5 },
  { item: "Banana", qty: 2 },
];

for (const line of order) {
  console.log(`${line.qty} x ${line.item}`);
}
```
- First item is `[0]` · a 3-item list has 0,1,2 · `[3]` returns `undefined` **silently**
- `array.length` · `Type[]` works on any type including your own interfaces
- Convention: plural for the list, singular for the loop variable

## 6. String Methods

```typescript
text.trim()                    // remove leading/trailing whitespace
text.includes("Username")      // → boolean (the #1 assertion check)
text.toUpperCase()             // case conversion
text.trim().toUpperCase()      // methods chain left to right
"a,b,c".split(",")             // → ["a","b","c"]  (string → ARRAY, then loop it)
```
- `.trim()` matters: `"Login  " === "Login"` is false while looking identical

## 7. Imports & Exports

```typescript
// helpers.ts
export const clickButton = (label: string): string => `Clicked: ${label}`;
export interface TestUser { username: string; }

// login.spec.ts
import { clickButton, TestUser } from "./helpers";   // ./ = same folder, no .ts
```
- A file only knows what's inside it · no `export` = private to that file

---

## 8. Playwright Test Anatomy

```typescript
import { test, expect } from "@playwright/test";

test("valid user can log in", async ({ page }) => {
  await page.goto("https://www.saucedemo.com");
  await page.getByPlaceholder("Username").fill("standard_user");
  await page.getByRole("button", { name: "Login" }).click();
  await expect(page.getByText("Products")).toBeVisible();
});
```
- `{ page }` = a fixture — a fresh browser page per test
- **Every action gets `await`**
- File must be `*.spec.ts` inside the `testDir` from the config
- **Every test needs an assertion** — an action is not a check

**Commands**
| Command | Purpose |
|---|---|
| `npx playwright test` | all tests, headless, parallel |
| `npx playwright test login` | only files matching "login" |
| `npx playwright test --headed` | show the browser |
| `npx playwright test --ui` | UI Mode: timeline, DOM snapshots, locator picker |
| `npx playwright test --debug` | step through with Inspector |
| `npx playwright show-report` | HTML report from last run |

**Config**
```typescript
use: { testIdAttribute: "data-test" }   // if the app doesn't use data-testid
expect: { timeout: 10000 }               // raise project-wide assertion timeout
```

## 9. Locators — Priority Order

| # | Locator | Note |
|---|---|---|
| 1 | `getByRole("button", { name: "Login" })` | how users/screen readers see it |
| 2 | `getByLabel("Username")` | field tied to visible label |
| 3 | `getByPlaceholder("Username")` | when no label exists |
| 4 | `getByText("Products")` | good for assertions, risky for clicks |
| 5 | `getByTestId("cart-badge")` | stable but invisible to users |
| 6 | `page.locator(".btn")` | CSS/XPath — last resort |

- **Pick the highest-priority strategy the MARKUP supports** — inspect before writing
- Role comes from the **element**, not CSS: `<a class="button">` is `getByRole("link")`
- Locators are **lazy** — no action/`expect` means nothing happens

## 10. Strict Mode

Multiple matches → violation. Playwright refuses to guess.

```typescript
// scope + filter (best — says what you mean)
await page.getByRole("row").filter({ hasText: "Iuvaret0" })
          .getByRole("link", { name: "edit" }).click();

// positional (works, fragile)
await page.getByRole("button", { name: "Add to cart" }).first().click();
await page.getByRole("link", { name: "edit" }).nth(3).click();

// count
await expect(page.getByRole("link", { name: "edit" })).toHaveCount(10);
```
- `.first()` means *"any will do"* — filter by content when identity matters

## 11. Auto-Waiting & Assertions

Before every action Playwright waits for: attached, visible, stable, enabled, not covered. Also auto-scrolls into view.

```typescript
await expect(locator).toBeVisible();               // ✅ retries until true; diagnostic failure
expect(await locator.isVisible()).toBe(true);       // ❌ one snapshot; fails with bare "false"

await expect(locator).toBeVisible({ timeout: 10000 });   // per-assertion override (default 5s)
```

**Never fixed waits:**
```typescript
await page.waitForTimeout(3000);                        // ❌
await expect(page.getByText("Loading")).toBeHidden();   // ✅ wait for state
await page.waitForURL("**/secure");                      // ✅ wait for navigation
await page.waitForResponse(r => r.url().includes("/api"));// ✅ wait for request
```
- Spinner pattern: assert the loader **disappears**, then assert the result

## 12. iframes, Dialogs, Tabs

**iframes** — locators don't cross frame boundaries; chain one level each:
```typescript
await expect(
  page.frameLocator("frame[name='frame-top']")
      .frameLocator("frame[name='frame-middle']")
      .getByText("MIDDLE")
).toBeVisible();
```

**Dialogs** — auto-dismissed by default (dismiss = Cancel). Register **before** the trigger:
```typescript
page.on("dialog", dialog => {          // no await — registering a listener
  dialog.accept();                      // ⚠️ MANDATORY — omit it and the page freezes
});
await page.getByRole("button", { name: "Click for JS Confirm" }).click();
```
- `dialog.message()` to assert what was asked · `dialog.dismiss()` to cancel
- `page.on` accumulates handlers — `page.once()` for one-shot

**New tabs** — a different page object; hold the promise, then click:
```typescript
test("...", async ({ page, context }) => {
  const newPagePromise = context.waitForEvent("page");   // unawaited = the IOU
  await page.getByRole("link", { name: "Click Here" }).click();
  const newPage = await newPagePromise;
  await expect(newPage.getByRole("heading", { name: "New Window" })).toBeVisible();
});
```

## 13. storageState Authentication

**Why:** logging in through the UI in every test is slow and a common flakiness source.
Being "logged in" is just holding a cookie — so capture it once and reuse it.

**Piece 1 — the setup file** (`tests/auth.setup.ts`):
```typescript
import { test as setup, expect } from "@playwright/test";

const authFile = "playwright/.auth/user.json";

setup("authenticate on saucedemo", async ({ page }) => {
  await page.goto("https://www.saucedemo.com");
  await page.getByPlaceholder("Username").fill("standard_user");
  await page.getByPlaceholder("Password").fill("secret_sauce");
  await page.getByRole("button", { name: "Login" }).click();
  await expect(page.getByText("Products")).toBeVisible();   // GUARD — assert before saving
  await page.context().storageState({ path: authFile });    // serialize cookies + localStorage
});
```
- `test as setup` — same function, renamed for readability
- Assert **after** the click and **before** the save, or you save a logged-out session
- One file per app — two apps need two `authFile` paths and two distinct setup names

**Piece 2 — the config:**
```typescript
projects: [
  { name: 'setup', testMatch: /auth\.setup\.ts/ },
  {
    name: 'saucedemo',
    testMatch: /(login|shopping)\.spec\.ts/,
    use: { ...devices['Desktop Chrome'], storageState: 'playwright/.auth/user.json' },
    dependencies: ['setup'],          // setup runs first and must pass
  },
],
```

**Piece 3 — the file split.** This is the part that matters:

| Test type | Session | How |
|---|---|---|
| Tests the login form | **empty** | `test.use({ storageState: { cookies: [], origins: [] } })` |
| Needs to be logged in | **saved** | nothing — inherits the project's `storageState` |

`test.use()` applies to the **whole file**, so the two groups must live in separate files:
- `login.spec.ts` → auth tests + `test.use` empty state + full login steps
- `shopping.spec.ts` → no `test.use`, starts authenticated, `goto` straight to the inner page

**storageState gives IDENTITY, not LOCATION** — every test still needs its own `goto`.
Saved session + `goto("/inventory.html")` = start shopping immediately.

**Gitignore it:** `playwright/.auth/` — the file is a live session. Committing it publishes a
working login.

**Sessions expire.** When they do, dependent tests fail with confusing "element not found"
errors rather than "logged out". The `dependencies: ['setup']` wiring regenerates state each
run, which is the mitigation.

**Interview answer:**
> "A setup project logs in once and saves the session with `storageState`; test projects
> declare that file plus a `dependencies` on setup, so tests start authenticated instead of
> logging in through the UI. Auth tests are the exception — they need a clean browser, so
> they sit in their own file with an empty `storageState` override. And the auth file must be
> gitignored since it's a live session."

## 14. Fixtures

A fixture is a named piece of setup a test **requests by name**. `page` is a built-in fixture —
that's why every test writes `async ({ page }) => {}`. Custom fixtures add your own names.

```typescript
// fixtures/fixtures.ts
import { test as base, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";

export const test = base.extend<{ loginPage: LoginPage }>({   // declare name + TYPE
  loginPage: async ({ page }, use) => {                        // depends on `page`
    await use(new LoginPage(page));                            // hand it to the test
  },
});

export { expect };          // re-export so specs get both from one import
```

- `test as base` — rename Playwright's test, or you get *"Cannot redeclare `test`"*
- `<{ name: Type }>` — the generic; repeat every fixture name and its type here
- **`await use(x)` is the hinge:** setup above it, the test runs at it, teardown below it
- All fixtures go in ONE `extend` call, comma-separated

**In the spec — import `test` from YOUR file, never from `@playwright/test`:**
```typescript
import { test, expect } from "../fixtures/fixtures";

test("checkout", async ({ inventoryPage, cartPage, checkoutPage }) => { ... });
```
Wrong import → *"Property 'checkoutPage' does not exist on type"*.

**Fixtures provide TOOLS, not decisions.** Don't `goto` inside a fixture — all fixtures a test
requests are created *before* the test body runs, so navigation there fires in the wrong order.
The test decides the journey.

**Fixtures vs hooks:** `beforeEach` applies to every test in scope whether it needs it or not.
Fixtures run only for tests that ask, are typed, compose (one can depend on another), and are
importable across files.

## 15. Data-Driven Tests

```typescript
interface LoginCase { username: string; password: string; expected: string; }

const cases: LoginCase[] = [
  { username: "standard_user",  password: "secret_sauce", expected: "Products" },
  { username: "locked_out_user", password: "secret_sauce", expected: "Epic sadface" },
];

for (const testCase of cases) {
  test(`login as ${testCase.username}`, async ({ page }) => {    // template literal name!
    ...
  });
}
```
- The loop wraps `test()` → N separate tests, run in parallel, reported individually
- **Names must be unique** — build them from the data
- Adding coverage = adding one line of data, not code

**From JSON** (lets non-developers extend the data):
```typescript
import rawCases from "./data/login-cases.json";
const cases: LoginCase[] = rawCases;      // type it — JSON gives no guarantees
```
Needs `"resolveJsonModule": true` in `tsconfig.json`, or you get
*"Type {} must have a [Symbol.iterator]()"*.

## 16. Tags

```typescript
test("checkout flow", { tag: "@smoke" }, async ({ page }) => { ... });
test("checkout flow", { tag: ["@smoke", "@regression"] }, async ({ page }) => { ... });
```
The tag object goes **between** the name and the function.

```bash
npx playwright test --grep @smoke
npx playwright test --grep-invert @slow
npx playwright test --grep "@smoke|@critical"
```
Typical use: `@smoke` on every PR (fast feedback), full suite nightly.
Smoke = the flows that, if broken, stop the release.

## 17. Page Object Model

One class per page. Locators become named properties, user actions become methods.

```typescript
// pages/LoginPage.ts
import { Page, Locator } from "@playwright/test";

export class LoginPage {
  readonly page: Page;
  readonly username: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {                                 // receives the page
    this.page = page;
    this.username = page.getByPlaceholder("Username");      // declare → define → use
    this.loginButton = page.getByRole("button", { name: "Login" });
  }

  async goto() { await this.page.goto("https://www.saucedemo.com"); }

  async loginAs(username: string, password: string) {
    await this.username.fill(username);
    await this.loginButton.click();
  }
}
```

**The three-step pattern:** declare at top (`readonly x: Locator`) → define in constructor →
use in methods. **Every** locator the class touches — none created inline inside a method.

**Assertions stay in the TEST, not the class:**
```typescript
await expect(checkoutPage.confirmationMessage).toContainText("Thank you");   // ✅ test
async verifyConfirmation() { await expect(...); }                            // ❌ in class
```
A class method containing an assertion locks in one expectation, hides what's verified from
the test, and usually gets a name that lies (`getX()` that returns nothing).

**One class per page.** `InventoryPage` / `CartPage` / `CheckoutPage`, not one class covering
the whole flow — otherwise it grows into a file nobody wants to open.

**Action methods vs getter methods:**
```typescript
async addFirstItemToCart() { await this.addButton.first().click(); }        // acts
async getProductCount(): Promise<number> { return this.items.count(); }     // reads
```
Prefer web-first assertions on exposed locators (`toHaveCount(6)`) — they retry. Use getters
when you need the **value** for logic (comparing two states), not just to assert.

**A test with POM + fixtures reads as a journey, with zero selectors:**
```typescript
test("checkout", async ({ inventoryPage, cartPage, checkoutPage }) => {
  await inventoryPage.goto();
  await inventoryPage.addFirstItemToCart();
  await inventoryPage.openCart();
  await cartPage.clickCheckout();
  await checkoutPage.fillUserDetails("Test", "User", "12345");
  await checkoutPage.clickFinish();
  await expect(checkoutPage.confirmationMessage).toContainText("Thank you");
});
```

**Structure:**
```
pages/       LoginPage.ts, InventoryPage.ts, CartPage.ts, CheckoutPage.ts
fixtures/    fixtures.ts  (hands out page object instances)
tests/       specs — thin, readable, no selectors
```

**A locator belongs to the page it appears on.** Don't put the inventory page's title on
`LoginPage` just because a login test asserts on it. When a test spans pages it holds several
page objects — that's normal, not a smell:
```typescript
test("valid user can log in", async ({ loginPage, inventoryPage }) => {
  await loginPage.goto();
  await loginPage.loginAs("standard_user", "secret_sauce");
  await expect(inventoryPage.pageTitle).toHaveText("Products");   // assert on the page you LANDED on
});
```

**Declare the minimum fixtures a test uses.** `async ({ inventoryPage })`, not
`async ({ page, inventoryPage })` — Playwright only builds what you declare. If you keep
needing raw `page`, that's a signal a locator is missing from a page object.

**Naming:**
- Locators: what a user sees (`cartBadge`), not the implementation (`shoppingCartBadgeSpan`)
- Don't let a name lie — a property holding an `<a>` is `logoutLink`, not `logoutButton`;
  a `getX()` that returns nothing is misnamed
- Methods: user intent (`checkout()`) over mechanics (`clickCheckout()`)

**Scoped locators beat `.first()`** when identity matters:
```typescript
this.page.locator(".inventory_item").first().locator("button")   // parent → child
```

**Page objects can hold any Playwright action:**
```typescript
async sortBy(option: string) {
  await this.sortDropdown.selectOption({ label: option });    // label = readable in the test
}
```

**Config, not hardcoding:** put `baseURL` in `playwright.config.ts` and use relative paths in
page objects (`goto("/cart.html")`), so switching environments is one line.

---

## Error Decoder

| Error | Meaning | Fix |
|---|---|---|
| Cannot assign to 'X' because it is a constant | reassigned a `const` | use `let` |
| Cannot redeclare block-scoped variable | same name twice in file | clear the file |
| Property 'X' is missing in type | object doesn't match interface | add the field |
| Argument of type 'number' is not assignable to 'string' | wrong type / swapped args | check call vs parameters |
| Cannot find name 'X' | doesn't exist in this file | typo, or needs import |
| Expected 2 arguments, but got 1 | count mismatch | one arg per parameter |
| Top-level await not supported | `await` outside an async function | move inside the braces |
| `Promise { <pending> }` in output | forgot `await` | add it |
| `undefined` in output | read past array end | last index = length − 1 |
| strict mode violation: resolved to N elements | ambiguous locator | filter, `.first()`, `.nth()` |
| element(s) not found (after timeout) | wrong locator or too slow | inspect DOM / raise timeout |
| Test timeout 30000ms during click | unhandled dialog blocking the page | `dialog.accept()` |
| No tests found (in a file that has tests) | parse error — stray character breaks the file | read the file, look for typos |
| Timeout waiting for an element after `goto` | landed on the login page — no valid session | check `storageState` + `dependencies`, or session expired |
| Test with no `goto` fails on first locator | blank page — session ≠ navigation | add the `goto` |
| Cannot redeclare block-scoped variable `test` | imported `test` AND declared it | `import { test as base }` |
| Property 'xPage' does not exist on type | spec imports `test` from `@playwright/test` | import from your fixtures file |
| Type {} must have a [Symbol.iterator]() | JSON import not resolving | add `"resolveJsonModule": true` to tsconfig |
| Cannot find name 'LoginPage' (did you mean loginPage?) | class not imported | `import { LoginPage } from "../pages/LoginPage"` |

## Environment

```bash
nvm alias default 20      # Node 20+ required; alias makes it stick across tabs
echo "20" > .nvmrc        # pin per project
```
- **VPN on** for npm (company Artifactory) — else `ENOTFOUND officeproxy`
- IntelliJ has its own Node setting: Settings → Languages & Frameworks → Node.js
- Three failure types: **your code** · **the environment** (network/VPN) · **the tooling** (Node/config)

## Git

```bash
git status → git add . → git commit -m "msg" → git push
```
- `~/.gitconfig` conditional includes route identity by folder (personal vs work)
- Verify before committing: `git config user.email` and read `git status` output

## Daily Drills (10 min, rotate)

| Drill | From a blank file, from memory |
|---|---|
| A | const, let + reassign, arrow function with template literal |
| B | interface → 2 objects → function with one object param → log both |
| C | slow helper + async test with 2 awaited steps + the call |
| D | interface → array of objects → for..of loop with dots |
| E | **Playwright login test** — import, test(), awaits, one assertion |

E is the interview practical. Retire a drill when it feels boring.
