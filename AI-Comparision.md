# AI-Generated vs Hand-Written Tests

I built this framework by hand, then ran the same task (saucedemo checkout) through an AI
assistant three times with different context, and reviewed each result against my own.

| Run | Context given | Result |
|---|---|---|
| 1 | Vague prompt, empty folder | Ran fine. Inline, no page objects, CSS class selectors on elements that had `data-test` attributes — it never inspected the page. |
| 2 | Same prompt, access to this repo | Inherited my fixtures and page object methods. Structure came free from the existing code. |
| 3 | Detailed prompt: POM, fixtures, locator priority, inspect the DOM | Matched my framework — and beat it in places. |

**Where Run 3 beat my hand-written version:**

- `getByLabel` for login fields — the inputs carry `aria-label` (higher priority than the
  `getByPlaceholder` I used). I verified this in the DOM before adopting it.
- `getByRole('button', { name: /^Cart/ })` for the cart link, matching the stable prefix of
  "Cart, N items"
- `filter({ hasText })` to name the product, instead of `.first()`
- `toHaveURL()` assertions between stages

I adopted all four. Implementing the third surfaced a real bug in my own code — I renamed the
method to take a product name but left a call site passing nothing, so the filter silently
matched all six products.

**Conclusion:** prompt specificity fixes structure, repo access fixes conventions, DOM access
fixes locators. But I could only write the Run 3 prompt because I knew what to ask for, and only
spot Run 1's weaknesses because I'd learned why CSS selectors rot. What the AI couldn't do was
decide what was worth testing.
