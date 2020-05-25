#!/usr/bin/env node
// @ts-check
'use strict';
const meow = require('meow');
const {main} = require('./main');

const cli = meow(
  `
  Usage

    $ inline-remote-assets <glob-pattern>

  Options
    --max Maximum size of asset to be inlined (in bytes), default 20kb

    Examples
    $ inline-remote-assets dist/**/*.html
  `,
  // @todo: add support
  // --output, -o Define a different output directory (defaults to overwriting files)
  {
    flags: {
      // Output: {
      //   type: 'string',
      //   alias: 'o'
      // },
      max: {
        type: 'number',
        default: 20000 // 20kb
      }
    }
  }
);

main(cli.input[0], cli.flags);
