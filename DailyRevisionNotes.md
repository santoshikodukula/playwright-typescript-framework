# Quick Revision Notes — TypeScript & Playwright

## Topics Covered

**TypeScript:** 1. Variables & types · 2. Functions & arrow functions · 3. Interfaces & objects · 4. Async/await · 5. Arrays & loops · 6. String methods · 7. Imports & exports

**Playwright:** 8. Test anatomy & setup · 9. Locators & priority order · 10. Strict mode · 11. Auto-waiting & assertions · 12. iframes, dialogs, tabs · 13. storageState authentication

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
