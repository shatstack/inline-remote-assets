const test = require('ava').default;
const fs = require('fs').promises;
const path = require('path');
const {ensureWriteablePath} = require('../src/utils');
const {main} = require('../src/main');

const sampleHtml = `<link
  href="https://cdn.jsdelivr.net/npm/tailwindcss@1.x.x/dist/tailwind.min.css"
  rel="stylesheet"
/>`;

test.before(async () => {
  await ensureWriteablePath('dist/test/index.html');
});
test.after(async () => {
  await fs.rmdir('dist/test', {recursive: true});
});

test('works with different output directory', async (t) => {
  const dir = await fs.mkdtemp('dist/test/main-in');
  const outDir = await fs.mkdtemp('dist/test/main-out');
  await fs.writeFile(path.join(dir, 'test.html'), sampleHtml, 'utf8');
  await main(`${dir}/*.html`, {maxSize: 20000, output: outDir});
  const original = await fs.readFile(path.join(dir, 'test.html'), 'utf8');
  const output = await fs.readFile(path.join(outDir, 'test.html'), 'utf8');

  t.is(original, sampleHtml);
  t.is(
    output,
    '<style>/*! normalize.css v8.0.1 | MIT License | github.com/necolas/normalize.css */*,::after,::before{box-sizing:border-box;border-width:0;border-style:solid;border-color:#e2e8f0}</style>'
  );
});

test('works when writing in-place', async (t) => {
  const dir = await fs.mkdtemp('dist/test/main-in');

  await fs.writeFile(path.join(dir, 'test.html'), sampleHtml, 'utf8');
  await main(`${dir}/*.html`, {maxSize: 20000});
  const original = await fs.readFile(path.join(dir, 'test.html'), 'utf8');

  t.is(
    original,
    '<style>/*! normalize.css v8.0.1 | MIT License | github.com/necolas/normalize.css */*,::after,::before{box-sizing:border-box;border-width:0;border-style:solid;border-color:#e2e8f0}</style>'
  );
});
