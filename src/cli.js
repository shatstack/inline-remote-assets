#!/usr/bin/env node
'use strict';
const meow = require('meow');
const {main} = require('./main');

const cli = meow(
  `
  Usage

    $ inline-remote-assets <glob-pattern>

  Options
    --max-size, -m Maximum size of asset to be inlined (in bytes), default 20000 (20kb)
    --output, -o Define a different output directory, default is to write files in place

  Examples
    $ inline-remote-assets dist/**/*.html
    $ inline-remote-assets dist/**/*.html --max-size 75000
    $ inline-remote-assets dist/**/*.html --output public
  `,
  {
    flags: {
      output: {
        type: 'string',
        alias: 'o'
      },
      maxSize: {
        type: 'number',
        default: 20000, // 20kb
        alias: 'm'
      }
    }
  }
);

main(cli.input[0], cli.flags);
