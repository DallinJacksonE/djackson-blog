import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { test } from 'node:test';
import { compile, run } from '@mdx-js/mdx';
import remarkGfm from 'remark-gfm';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import * as runtime from 'react/jsx-runtime';

const root = new URL('../src/content/tutorials/', import.meta.url);
const inventory = new Set((await readdir(root)).filter(name => name.endsWith('.mdx')).map(name => name.slice(0, -4)));

for (const [slug, title] of [
  ['git-basics', 'Git Basics'],
  ['writing-markdown', 'Writing in Markdown'],
  ['latex-projects', 'Building a LaTeX Project'],
  ['github-project-boards', 'Collaborate with GitHub Projects'],
]) {
  test(`${slug} compiles, renders, and links to existing tutorials`, async () => {
    const source = await readFile(new URL(`${slug}.mdx`, root), 'utf8');
    const compiled = await compile(source, { remarkPlugins: [remarkGfm], outputFormat: 'function-body' });
    const article = await run(compiled, runtime);
    assert.equal(article.meta.title, title);
    assert.ok(article.meta.description.length > 20);
    assert.ok(article.meta.tags.length >= 2);
    assert.ok(Number.isFinite(new Date(article.meta.date).getTime()));
    const html = renderToStaticMarkup(createElement(article.default));
    assert.ok((html.match(/<h2>/g) || []).length >= 3);
    assert.ok(!html.includes('<h1>'), 'the article view supplies the page title');
    assert.match(html, /Sources/);
    for (const match of html.matchAll(/href="\/tutorials\/([^"]+)"/g)) {
      assert.ok(inventory.has(match[1]), `broken tutorial link: ${match[1]}`);
    }
    if (slug === 'writing-markdown') {
      assert.match(html, /```bash/, 'nested code fences remain literal');
      assert.match(html, /language-markdown/);
    }
    if (slug === 'latex-projects') assert.match(html, /language-latex/);
  });
}
