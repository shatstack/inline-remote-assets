const {test} = require('uvu');
const assert = require('uvu/assert');
const fs = require('fs').promises;
const path = require('path');
const {ensureWriteablePath} = require('../src/utils');
const {main} = require('../src/main');

const sampleHtml = `<link
  href="https://cdn.jsdelivr.net/npm/tailwindcss@1.7.x/dist/tailwind.min.css"
  rel="stylesheet"
/>`;

test.before(async () => {
  await ensureWriteablePath('dist/index.html');
});

test('works with different output directory', async () => {
  const dir = await fs.mkdtemp('dist/origin-dir');
  const outDir = await fs.mkdtemp('dist/output-dir');
  await fs.writeFile(path.join(dir, 'test.html'), sampleHtml, 'utf8');
  await main(`${dir}/*.html`, {maxSize: 20000, output: outDir});
  const original = await fs.readFile(path.join(dir, 'test.html'), 'utf8');
  const output = await fs.readFile(path.join(outDir, 'test.html'), 'utf8');

  assert.is(original, sampleHtml);
  assert.is(
    output,
    '<style>/*! normalize.css v8.0.1 | MIT License | github.com/necolas/normalize.css */*,::after,::before{box-sizing:border-box;border-width:0;border-style:solid;border-color:#e2e8f0}@keyframes spin{to{transform:rotate(360deg)}}@keyframes ping{100%,75%{transform:scale(2);opacity:0}}@keyframes pulse{50%{opacity:.5}}@keyframes bounce{0%,100%{transform:translateY(-25%);animation-timing-function:cubic-bezier(.8,0,1,1)}50%{transform:none;animation-timing-function:cubic-bezier(0,0,.2,1)}}</style>'
  );
});

test('works when writing in-place', async () => {
  const dir = await fs.mkdtemp('dist/in-place');

  await fs.writeFile(path.join(dir, 'test.html'), sampleHtml, 'utf8');
  await main(`${dir}/*.html`, {maxSize: 20000});
  const original = await fs.readFile(path.join(dir, 'test.html'), 'utf8');

  assert.is(
    original,
    '<style>/*! normalize.css v8.0.1 | MIT License | github.com/necolas/normalize.css */*,::after,::before{box-sizing:border-box;border-width:0;border-style:solid;border-color:#e2e8f0}@keyframes spin{to{transform:rotate(360deg)}}@keyframes ping{100%,75%{transform:scale(2);opacity:0}}@keyframes pulse{50%{opacity:.5}}@keyframes bounce{0%,100%{transform:translateY(-25%);animation-timing-function:cubic-bezier(.8,0,1,1)}50%{transform:none;animation-timing-function:cubic-bezier(0,0,.2,1)}}</style>'
  );
});

test.run();
