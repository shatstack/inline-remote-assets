/**
 * Inline Remote Assets
 * @module inline-remote-assets/main
 */
'use strict';
const inlineCss = require('./inline-css');
const inlineJs = require('./inline-js');
const {ensureWriteablePath} = require('./utils');
// Required only for main()
const glob = require('tiny-glob');
const fs = require('fs').promises;
const path = require('path');

module.exports = {
  inlineCss,
  inlineJs,
  /**
   *
   * @param {string} globPattern
   * @param {object} options
   * @param {number} options.maxSize - Maximum size of asset to be inlined (in bytes)
   * @param {string} [options.output]
   * @returns {Promise<void>}
   */
  async main(globPattern, options) {
    // @todo add warning that `./dist/*.html` doesn't work?
    const paths = await glob(globPattern);
    await Promise.all(
      paths.map(async (inputPath) => {
        try {
          let outputPath = inputPath;
          let timerName = inputPath;
          if (options.output) {
            outputPath = path.join(options.output, path.basename(inputPath));
            timerName = `${inputPath} -> ${outputPath}`;
          }

          console.time(timerName);
          // Read file
          const initialHtml = await fs.readFile(inputPath, 'utf8');
          // Run transforms
          const newHtml = await Promise.resolve(initialHtml)
            .then((html) => inlineCss(html, options))
            .then((html) => inlineJs(html, options));

          // Create directories if necessary, useful when output is defined
          await ensureWriteablePath(outputPath);
          // Write back to file
          await fs.writeFile(outputPath, newHtml, 'utf8');
          console.timeEnd(timerName);
        } catch (error) {
          console.error(`${inputPath}: ${error.stack}`);
        }
      })
    );
  }
};
