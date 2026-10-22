import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { before, after, test } from 'node:test';
import { readdir } from 'node:fs/promises';

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE_PATH || 'playwright');
const origin = process.env.UI_TEST_URL || 'http://127.0.0.1:5175';
let browser;
let page;
const errors = [];
before(async () => {
  browser = await chromium.launch({ headless: true, executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium' });
  page = await browser.newPage();
  page.setDefaultTimeout(8000);
  page.on('pageerror', error => errors.push(error.message));
});
after(async () => { await browser?.close(); });

test('fenced code has one dark background and readable text in both themes', async () => {
  await page.goto(`${origin}/tutorials/writing-markdown`);
  await page.locator('article pre code').first().waitFor();
  for (const theme of ['light', 'dark']) {
    await page.evaluate(value => document.documentElement.setAttribute('data-theme', value), theme);
    const blocks = await page.locator('article pre').evaluateAll(nodes => nodes.map(node => {
      const pre = getComputedStyle(node);
      const code = getComputedStyle(node.querySelector('code'));
      const luminance = color => {
        const rgb = color.match(/[\d.]+/g).slice(0, 3).map(Number).map(value => {
          const srgb = value / 255;
          return srgb <= 0.04045 ? srgb / 12.92 : ((srgb + 0.055) / 1.055) ** 2.4;
        });
        return rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722;
      };
      const background = luminance(pre.backgroundColor);
      const foreground = luminance(code.color);
      return {
        background,
        contrast: (Math.max(background, foreground) + 0.05) / (Math.min(background, foreground) + 0.05),
        codeBackground: code.backgroundColor,
        codePadding: code.padding,
        sameColor: code.color === pre.color,
        overflow: pre.overflowX,
      };
    }));
    assert.ok(blocks.length > 0);
    for (const block of blocks) {
      assert.ok(block.background < 0.1, `${theme}: code panel is too bright`);
      assert.ok(block.contrast >= 7, `${theme}: insufficient text contrast`);
      assert.equal(block.codeBackground, 'rgba(0, 0, 0, 0)', `${theme}: nested code creates a second background`);
      assert.equal(block.codePadding, '0px');
      assert.equal(block.sameColor, true);
      assert.equal(block.overflow, 'auto');
    }
  }
});

test('all new tutorials appear in the index and render through their links', async () => {
  const tutorials = [
    ['git-basics', 'Git Basics'],
    ['writing-markdown', 'Writing in Markdown'],
    ['latex-projects', 'Building a LaTeX Project'],
    ['github-project-boards', 'Collaborate with GitHub Projects'],
  ];
  await page.goto(`${origin}/tutorials`);
  const inventory = (await readdir(new URL('../src/content/tutorials', import.meta.url))).filter(name => name.endsWith('.mdx'));
  const links = page.locator('main a[href^="/tutorials/"]');
  await links.first().waitFor();
  assert.equal(await links.count(), inventory.length);
  for (const [slug, title] of tutorials) {
    await page.locator(`main a[href="/tutorials/${slug}"]`).click();
    await page.waitForURL(`${origin}/tutorials/${slug}`);
    await page.getByRole('heading', { name: title, exact: true, level: 1 }).waitFor();
    await page.waitForFunction(() => document.querySelectorAll('article h2').length >= 3);
    if (slug !== 'github-project-boards') assert.ok(await page.locator('article pre code').count() > 0);
    assert.equal(await page.getByText('404 - Article Not Found', { exact: true }).count(), 0);
    await page.getByRole('link', { name: 'Back to tutorials' }).click();
    await page.waitForURL(`${origin}/tutorials`);
  }
});

test('code panels scroll internally on narrow screens', async () => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${origin}/tutorials/latex-projects`);
  await page.locator('article pre').first().waitFor();
  for (const block of await page.locator('article pre').all()) {
    assert.ok(await block.evaluate(node => node.getBoundingClientRect().right <= document.documentElement.clientWidth));
  }
});

test('tutorials caused no uncaught browser errors', () => { assert.deepEqual(errors, []); });
