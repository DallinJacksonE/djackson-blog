# Tutorial checks

From the blog root:

    node --test tests/tutorial-content.test.mjs
    npm run build
    npm run lint

The content tests compile the four new tutorials with the same MDX/GFM plugins as Vite, render them through React, and check metadata, cross-links, headings, and nested code fences.

## Browser checks

Install a scratch Playwright runner, then start the site:

    npm install --prefix "$TMPDIR/blog-ui-check" playwright --no-package-lock --no-audit --no-fund
    npm run dev -- --host 127.0.0.1 --port 5175 --strictPort

In another terminal:

    PLAYWRIGHT_MODULE_PATH="$TMPDIR/blog-ui-check/node_modules/playwright" node --test tests/tutorials.browser.test.mjs

The tests use system Chromium at `/usr/bin/chromium`; override `CHROMIUM_PATH` if needed. If Playwright is already locally installed, omit `PLAYWRIGHT_MODULE_PATH`.

For production verification, build and start `npm run preview -- --host 127.0.0.1 --port 4175 --strictPort`, then set `UI_TEST_URL=http://127.0.0.1:4175` on the browser command.

Browser assertions cover all tutorial cards and article routes, readable fenced code in light/dark themes, transparent nested code backgrounds, internal code-panel scrolling on narrow screens, and uncaught application errors. They do not create any real GitHub projects, issues, or pull requests.

## Worked examples

The LaTeX tutorial labels the three `latex` fences as `main.tex`, `sections/introduction.tex`, and `sections/results.tex`; the `bibtex` fence supplies `references.bib`. Save these under a scratch directory, then run the documented `latexmk` command from that directory. Check the final log and the PDF's bibliography and references.

Practice the Git commands in a disposable repository. Any example GitHub URL, account name, email, or issue number must be replaced with the reader's actual value before use. Never use a production repository to test conflict or undo examples.
