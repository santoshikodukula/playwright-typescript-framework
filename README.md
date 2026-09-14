# Playwright TypeScript Test Framework

[![Playwright Tests](https://github.com/santoshikodukula/playwright-typescript-framework/actions/workflows/playwright.yml/badge.svg)](https://github.com/santoshikodukula/playwright-typescript-framework/actions/workflows/playwright.yml)

End-to-end test automation built with Playwright and TypeScript, running against public practice sites.
Tests run on every push via GitHub Actions.

## What's covered
- **saucedemo** — login (data-driven), cart, five-page checkout flow
- **the-internet** — iframes, JS dialogs, new tabs, dynamic loading, strict-mode filtering
- **demoqa** — form validation, checkbox trees, select menus, click variants, double-click and right-click actions

## Structure
```
pages/        Page objects — one class per page, locators as properties
fixtures/     Custom fixtures that hand page objects to tests
tests/        Specs — thin, readable, no selectors
  auth.setup.ts    Authenticates once, saves session state
  data/            JSON test data for data-driven suites
```

## Running the tests

```bash
npm install
npx playwright install

npx playwright test                    # all tests, headless
npx playwright test --headed           # watch the browser
npx playwright test --ui               # UI Mode with trace viewer
npx playwright test --grep @smoke      # smoke suite only
npx playwright show-report             # open the HTML report
```

Requires Node.js 20+ 

## Techniques used

- **Page Object Model** — one class per page; assertions stay in tests
- **Custom fixtures** — page objects delivered via `test.extend()`
- **`storageState` auth** — log in once, reuse the session; auth tests run with a clean one
- **Role- and label-based locators**, chosen to match each app's markup
- **Web-first assertions** — no fixed waits anywhere
- **Data-driven tests** from typed JSON
- **Tags** — `@smoke` / `@regression` for running subsets
- **CI** — GitHub Actions on every push, HTML report as an artifact

## Roadmap
- [x] Page Object Model
- [x] Custom fixtures
- [x] CI via GitHub Actions
- [ ] API tests with Playwright's request context
- [ ] Hybrid tests: API setup with UI verification
- [ ] Parallel sharding in CI
