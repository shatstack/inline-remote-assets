const {test} = require('uvu');
const assert = require('uvu/assert');
const {inlineCss} = require('../src/main');

const defaultOptions = {};

const sampleCssInclude = `<link
  href="https://cdn.jsdelivr.net/npm/tailwindcss@1.7.x/dist/tailwind.min.css"
  rel="stylesheet"
/>`;

const sampleInline =
  '<style>/*! normalize.css v8.0.1 | MIT License | github.com/necolas/normalize.css */*,::after,::before{box-sizing:border-box;border-width:0;border-style:solid;border-color:#e2e8f0}@keyframes spin{to{transform:rotate(360deg)}}@keyframes ping{100%,75%{transform:scale(2);opacity:0}}@keyframes pulse{50%{opacity:.5}}@keyframes bounce{0%,100%{transform:translateY(-25%);animation-timing-function:cubic-bezier(.8,0,1,1)}50%{transform:none;animation-timing-function:cubic-bezier(0,0,.2,1)}}</style>';

test('replaces <link href=""> with <style>Purged styles</style>', async () => {
  const output = await inlineCss(sampleCssInclude, defaultOptions);
  assert.is(
    output.includes(
      'href="https://cdn.jsdelivr.net/npm/tailwindcss@1.7.x/dist/tailwind.min.css"'
    ),
    false
  );
  assert.is(output, sampleInline);
});

const sampleTailwindUsage = `${sampleCssInclude}
<body class="flex flex-col">
  <header
    class="flex w-full px-10 py-2 border border-b border-solid border-gray-600"
  >
    <a href="/" class="text-xl font-semibold text-gray-900">
      Random application
    </a>
  </header>
</body>`;

test('keeps used Tailwind classes', async () => {
  const output = await inlineCss(sampleTailwindUsage, defaultOptions);
  const outputHead = output.split('<body')[0].trim();
  assert.snapshot(
    outputHead,
    '<style>/*! normalize.css v8.0.1 | MIT License | github.com/necolas/normalize.css */body{margin:0}a{background-color:transparent}*,::after,::before{box-sizing:border-box;border-width:0;border-style:solid;border-color:#e2e8f0}a{color:inherit;text-decoration:inherit}.border-gray-600{--border-opacity:1;border-color:#718096;border-color:rgba(113,128,150,var(--border-opacity))}.border-solid{border-style:solid}.border{border-width:1px}.border-b{border-bottom-width:1px}.flex{display:flex}.flex-col{flex-direction:column}.font-semibold{font-weight:600}.text-xl{font-size:1.25rem}.py-2{padding-top:.5rem;padding-bottom:.5rem}.px-10{padding-left:2.5rem;padding-right:2.5rem}.text-gray-900{--text-opacity:1;color:#1a202c;color:rgba(26,32,44,var(--text-opacity))}.w-full{width:100%}@keyframes spin{to{transform:rotate(360deg)}}@keyframes ping{100%,75%{transform:scale(2);opacity:0}}@keyframes pulse{50%{opacity:.5}}@keyframes bounce{0%,100%{transform:translateY(-25%);animation-timing-function:cubic-bezier(.8,0,1,1)}50%{transform:none;animation-timing-function:cubic-bezier(0,0,.2,1)}}</style>'
  );
});

const relativeStyleSheet = `<link rel="stylesheet" href="./relative.css" />`;

test('keeps relative stylesheet includes', async () => {
  assert.is(
    await inlineCss(relativeStyleSheet, defaultOptions),
    relativeStyleSheet
  );
});

const styleSheetNoHref = `<link rel="stylesheet" />`;

test('keeps stylesheets without href', async () => {
  assert.is(
    await inlineCss(styleSheetNoHref, defaultOptions),
    styleSheetNoHref
  );
});

test('inlines stylesheets smaller than passed "maxSize" option', async () => {
  assert.is(await inlineCss(sampleCssInclude, {maxSize: 20000}), sampleInline);
});

test('keeps CDN tag for stylesheets larger than "maxSize" option', async () => {
  assert.is(await inlineCss(sampleCssInclude, {maxSize: 5}), sampleCssInclude);
});

test('inlines stylesheets when size > cssMaxSize but size < maxSize', async () => {
  assert.is(
    await inlineCss(sampleCssInclude, {cssMaxSize: 20000, maxSize: 5}),
    sampleInline
  );
});

test('keeps CDN tag for stylesheets when size < cssMaxSize even if size > maxSize', async () => {
  assert.is(
    await inlineCss(sampleCssInclude, {cssMaxSize: 5, maxSize: 20000}),
    sampleCssInclude
  );
});

test.run();
