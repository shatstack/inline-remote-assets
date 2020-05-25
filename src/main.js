// @ts-check
/**
 * Inline Remote Assets
 * @module inline-remote-assets/main
 */
'use strict';
const inlineCss = require('./inline-css');
const inlineJs = require('./inline-js');
// Required only for main()
const glob = require('tiny-glob');
const fs = require('fs').promises;

module.exports = {
  inlineCss,
  inlineJs,
  /**
   *
   * @param {string} globPattern
   * @param {object} options
   * @param {string} [options.output]
   * @param {number} options.max - Maximum size of asset to be inlined (in bytes)
   * @returns {Promise<void>}
   */
  async main(globPattern, options) {
    // @todo add warning that `./dist/*.html` doesn't work?
    const paths = await glob(globPattern);
    await Promise.all(
      paths.map(async (path) => {
        try {
          console.time(path);
          // Read file
          const initialHtml = await fs.readFile(path, 'utf8');
          // Run transform
          const newHtml = await Promise.resolve(initialHtml)
            .then((html) => inlineCss(html, options))
            .then((html) => inlineJs(html, options));
          // @todo support custom output path
          const outputPath = path;
          // Write back to file
          await fs.writeFile(outputPath, newHtml, 'utf8');
          console.timeEnd(path);
        } catch (error) {
          console.error(`${path}: ${error.stack}`);
        }
      })
    );
  }
};
