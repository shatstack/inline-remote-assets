![test](https://github.com/HugoDF/jsdoc-type-d-ts-node-pkg/workflows/test/badge.svg)

# Node.js module with TypeScript typings (types.d.ts) generated from JSDoc

Example repo for a Node.js module with TypeScript typings ([./types.d.ts](./types.d.ts)) generated from JSDoc annotations.

Project setup, files/directories of interest are [./src/main.js](./src/main.js), [./tests](./tests) and [./types.d.ts](./types.d.ts).

```
├── LICENSE
├── README.md
├── node_modules
│   └── ...
├── package.json
├── src
│   └── main.js
├── tests
│   └── ping.js
├── types.d.ts
└── yarn.lock
```

Comes ready to develop with: 

- [ava](https://avajs.dev) for testing
- [jsdoc](https://github.com/jsdoc/jsdoc) and [tsd-jsdoc](https://github.com/englercj/tsd-jsdoc) to generate the [./types.d.ts](./types.d.ts) file.
- [xo](https://github.com/xojs/xo#readme) for linting/formatting

## Quickstart

Use the GitHub "Template" functionality or clone the repo (take care to remove the `.git` folder in that case).

# Contributing

## Requirements

- Node 12
- Yarn 1.x or npm

## Setup

1. Clone the repository
2. Run `yarn` or `npm install` installs all required dependencies.

## npm scripts

> Equivalent `npm run <script>` should also work

- `yarn test` run tests with [ava](https://github.com/avajs/ava).
- `yarn build` will run JSDoc -> TypeScript typing conversion with [jsdoc](https://github.com/jsdoc/jsdoc) and [tsd-jsdoc](https://github.com/englercj/tsd-jsdoc), changes to [./types.d.ts](./types.d.ts) shoud be committed.
- `yarn lint` will lint all of the files with [xo](https://github.com/xojs/xo)
- `yarn format` will run lint with `--fix` option on all the examples files (and tests).

# About

This package is maintained by Hugo from [Code with Hugo](https://codewithhugo.com) and [Alpine.js Weekly](https://alpinejs.codewithhugo.com/newsletter).

## Acknowledgments


Special thanks to:

- The developers behind
  - [ava](https://avajs.dev)
  - [jsdoc](https://github.com/jsdoc/jsdoc)
  - [tsd-jsdoc](https://github.com/englercj/tsd-jsdoc)
  - [xo](https://github.com/xojs/xo#readme)

# LICENSE

Code is licensed under the [MIT License](./LICENSE).

