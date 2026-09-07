# Playwright TypeScript Test Framework

End-to-end test automation built with Playwright and TypeScript, running against
[saucedemo.com](https://www.saucedemo.com).

## What's covered

- **Login (positive)** — valid user reaches the products page
- **Login (negative)** — locked-out user sees the expected error message
- **Add to cart** — item is added and the cart badge updates
- **Checkout** — full five-page flow from login to order confirmation

Tests run across Chromium, Firefox, and WebKit.

## Running the tests

```bash
npm install
npx playwright install
npx playwright test              # all tests, headless
npx playwright test --headed     # watch the browser
npx playwright test --ui         # UI Mode with trace viewer
npx playwright show-report       # open the HTML report
```

Requires Node.js 20+.

## Techniques used

- Role- and placeholder-based locators over CSS selectors, for resilience
- `testIdAttribute` configured to `data-test` to match the application's markup
- Web-first assertions (`toBeVisible`, `toHaveText`) with automatic retry
- Cross-browser execution via Playwright projects

## Roadmap

- [ ] Page Object Model refactor
- [ ] API tests
- [ ] CI via GitHub Actions
