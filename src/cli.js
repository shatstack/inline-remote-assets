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
    --css-max-size Maximum size of CSS asset to be inlined (in bytes), overwrites maxSize, defaults to maxSize value (20kb)

  Examples
    Inline CSS and JS for .html files in dist (write in place):
    $ inline-remote-assets 'dist/**/*.html'

    Set JS and CSS max size to inline to 75kb:
    $ inline-remote-assets 'dist/**/*.html' --max-size 75000

    Inline HTML files in dist and output to public
    $ inline-remote-assets 'dist/**/*.html' --output public

    Set JS max size to inline 75kb and CSS max size to inline to 100kb.
    $ inline-remote-assets 'dist/**/*.html' --max-size 75000 --css-max-size 100000
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
      },
      cssMaxSize: {
        type: 'number'
      }
    }
  }
);

main(cli.input[0], cli.flags);
