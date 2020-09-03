![test](https://github.com/shatstack/inline-remote-assets/workflows/test/badge.svg)
![npm version](https://img.shields.io/npm/v/inline-remote-assets)

# Inline remote assets

Improve load performance by inlining and optimising remote assets loaded through CDN.

0-config CSS and JavaScript inlining and purging, designed for users of Alpine.js and TailwindCSS.

## Quickstart

If you have a directory of HTML files at `dist` you can purge/inline the CSS and inline JavaScript CDN includes less than 20kb with:

```sh
npx inline-remote-assets 'dist/**/*.html'
```

Example input HTML file with Tailwind, Tailwind Typography, Alpine.js, styleNames and Spruce:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link
      href="https://cdn.jsdelivr.net/npm/tailwindcss@1.x.x/dist/tailwind.min.css"
      rel="stylesheet"
    />
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/@tailwindcss/typography@0.2.x/dist/typography.min.css"
    />
    <script src="https://cdn.jsdelivr.net/npm/@shat/stylenames@v1.x.x/lib/index.umd.js"></script>
    <script src="https://cdn.jsdelivr.net/gh/ryangjchandler/spruce@0.x.x/dist/spruce.umd.js"></script>
    <script
      src="https://cdn.jsdelivr.net/gh/alpinejs/alpine@2.x.x/dist/alpine.min.js"
      defer
    ></script>
  </head>

  <body class="flex flex-col">
    <header
      class="flex w-full px-10 py-2 border border-b border-solid border-gray-600"
    >
      <a href="/" class="text-xl font-semibold text-gray-900">
        Random application
      </a>
    </header>
    <div class="prose">
      <p>With Tailwind typography plugin from CDN</p>
    </div>
  </body>
</html>
```

Example output HTML file (after `npx inline-remote-assets dist/*.html`). We've saved loading 3 assets (TailwindCSS, Spruce and stylenames) but Alpine.js, being over 20kb still gets loaded from CDN.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>/*! normalize.css v8.0.1 | MIT License | github.com/necolas/normalize.css */html{line-height:1.15;-webkit-text-size-adjust:100%}body{margin:0}a{background-color:transparent}html{font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";line-height:1.5}*,::after,::before{box-sizing:border-box;border-width:0;border-style:solid;border-color:#e2e8f0}a{color:inherit;text-decoration:inherit}.border-gray-600{--border-opacity:1;border-color:#718096;border-color:rgba(113,128,150,var(--border-opacity))}.border-solid{border-style:solid}.border{border-width:1px}.border-b{border-bottom-width:1px}.flex{display:flex}.flex-col{flex-direction:column}.font-semibold{font-weight:600}.text-xl{font-size:1.25rem}.py-2{padding-top:.5rem;padding-bottom:.5rem}.px-10{padding-left:2.5rem;padding-right:2.5rem}.text-gray-900{--text-opacity:1;color:#1a202c;color:rgba(26,32,44,var(--text-opacity))}.w-full{width:100%}</style>
    <script>!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):(e=e||self).stylenames=t()}(this,function(){function e(e){if(!e||"object"!=typeof e)return"";if(Array.isArray(e))return e.join(";")+";";for(var t="",o=0,n=Object.keys(e);o<n.length;o++){var f=n[o],r=e[f];if("string"!=typeof r)if("boolean"!=typeof r){if("object"==typeof r&&0!==r.length)for(var i=e[f],s=0,a=Object.keys(i);s<a.length;s++){var y=a[s];if("function"!=typeof i[y]&&i[y]||"function"==typeof i[y]&&i[y]()){t+=f+":"+y+";";break}}}else t+=f;else t+=f+":"+r+";"}return t.replace(/([a-z])([A-Z])/g,"$1-$2").replace(/[_\s]/,"-").toLowerCase()}return window&&(window.styleNames=e),e});
//# sourceMappingURL=index.umd.js.map
</script>
    <script>!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e():"function"==typeof define&&define.amd?define(e):t.spruce=e()}(this,function(){function t(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}function e(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);e&&(r=r.filter(function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable})),n.push.apply(n,r)}return n}var n=function(t){return null==t},r=function(t,e){return Object.keys(t).forEach(function(o){n(t[o])||Object.getPrototypeOf(t[o])!==Object.prototype||(t[o]=r(t[o],e))}),new Proxy(t,{get:function(t,n){return e.hasOwnProperty("get")&&e.get(n),t[n]},set:function(t,o,i){var s=t[o];return n(i)||"object"!=typeof i||(i=r(i,e)),e.set(t,o,t[o]=i,s),!0}})},o={options:{globalStoreVariable:!1},events:{watchers:{},events:{},on:function(t,e,n){var r=this;return void 0===n&&(n=!1),this.events[t]||(this.events[t]=[]),this.events[t].push({callback:e,once:n}),function(){return r.off(t,e)}},once:function(t,e){this.on(t,e,!0)},off:function(t,e){this.events[t]=this.events[t].filter(function(t){return t.callback!==e&&!0!==t.once})},emit:function(t,e){var n=this;void 0===e&&(e={}),this.events[t]&&this.events[t].forEach(function(r){r.callback(e),r.once&&n.off(t,r)}),window.dispatchEvent(new CustomEvent("spruce:"+t,{detail:e,bubbles:!0}))},watch:function(t,e){this.watchers[t]||(this.watchers[t]=[]),this.watchers[t].push(e)},runWatchers:function(t,e,n,r){var o=this;if(o.watchers[n])return o.watchers[n].forEach(function(t){return t(r,e[n])});Object.keys(o.watchers).filter(function(t){return t.includes(".")}).forEach(function(i){var s=i.split(".");n===s[s.length-1]&&s.reduce(function(t,s){return(t[n]===e[n]||Object.is(e,t))&&o.watchers[i].forEach(function(t){return t(r,e[n])}),t[s]},t)})}},stores:{},subscribers:[],start:function(){try{var t=this;return Promise.resolve(new Promise(function(t){"loading"==document.readyState?document.addEventListener("DOMContentLoaded",t):t()})).then(function(){t.emit("init"),document.querySelectorAll("[x-subscribe]").forEach(function(t){t.setAttribute("x-init",function(t){var e="$store = Spruce.subscribe($el)";return t.hasAttribute("x-init")&&(e=e+"; "+t.getAttribute("x-init")),e}(t)),t.removeAttribute("x-subscribe")}),t.stores=r(t.stores,{set:function(e,n,r,o){t.events.runWatchers(t.stores,e,n,o),t.updateSubscribers()}}),t.options.globalStoreVariable&&(document.querySelectorAll("[x-data]").forEach(function(e){t.subscribers.includes(e)||t.subscribers.push(e)}),window.$store=t.stores)})}catch(t){return Promise.reject(t)}},store:function(t,e){return this.stores[t]||(this.stores[t]=e),this.stores[t]},reset:function(t,e){this.stores[t]=e},subscribe:function(t){return this.subscribers.push(t),this.stores},updateSubscribers:function(){this.subscribers.forEach(function(t){void 0!==t.__x&&t.__x.updateElements(t)})},config:function(t){void 0===t&&(t={}),this.options=Object.assign(this.options,t)},on:function(t,e){return this.events.on(t,e)},once:function(t,e){return this.events.once(t,e)},off:function(t,e){this.events.off(t,e)},emit:function(n,r){void 0===r&&(r={}),this.events.emit(n,function(n){for(var r=1;r<arguments.length;r++){var o=null!=arguments[r]?arguments[r]:{};r%2?e(Object(o),!0).forEach(function(e){t(n,e,o[e])}):Object.getOwnPropertyDescriptors?Object.defineProperties(n,Object.getOwnPropertyDescriptors(o)):e(Object(o)).forEach(function(t){Object.defineProperty(n,t,Object.getOwnPropertyDescriptor(o,t))})}return n}({},r,{store:this.stores}))},watch:function(t,e){this.events.watch(t,e)}},i=window.deferLoadingAlpine||function(t){t()};return window.deferLoadingAlpine=function(t){window.Spruce=o,window.Spruce.start(),i(t)},o});
//# sourceMappingURL=spruce.umd.js.map
</script>
    <script
      src="https://cdn.jsdelivr.net/gh/alpinejs/alpine@2.x.x/dist/alpine.min.js"
      defer
    ></script>
  </head>

  <body class="flex flex-col">
    <header
      class="flex w-full px-10 py-2 border border-b border-solid border-gray-600"
    >
      <a href="/" class="text-xl font-semibold text-gray-900">
        Random application
      </a>
    </header>
  </body>
</html>
```


## Installation

You can run the script using `npx`:

```sh
npx inline-remote-assets 'dist/**/*.html'
```

You can also install it globally:

```sh
npm install -g inline-remote-assets
# or using Yarn
yarn global add inline-remote-assets
```

It's now runnable as `inline-remote-assets`.

## Options

### --output, -o

`--output` or `-o` can be used to define a different output directory, default is to write files in place (overwrite).

Example to output the matched `dist` files to `public`:

```sh
inline-remote-assets 'dist/**/*.html' --output public

dist/sample.html -> public/sample.html: 1141.294ms
```

### --max-size, -m

`--max-size` or `-m` can be used to define the maximum size of JavaScript/CSS assets to be inlined (in bytes), default 20000 (20kb).

Example to set the max-size of JS files to inline to 75kb:

```sh
inline-remote-assets 'dist/**/*.html' --max-size 75000

dist/sample.html: 953.339ms
```

### --css-max-size

`--css-max-size` can be used to define the maximum size of CSS assets to be inlined (in bytes), it **supercedes** `maxSize` when set, defaults to the value of maxSize or 20000 (20kb).

```sh
$ inline-remote-assets 'dist/**/*.html' --max-size 75000 --css-max-size 100000

dist/sample.html: 17.221ms
```

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
- `yarn build` will run JSDoc -> TypeScript typing conversion with [jsdoc](https://github.com/jsdoc/jsdoc) and [tsd-jsdoc](https://github.com/englercj/tsd-jsdoc), changes to [./types.d.ts](./types.d.ts) should be committed.
- `yarn lint` will lint all of the files with [xo](https://github.com/xojs/xo)
- `yarn format` will run lint with `--fix` option on all the examples files (and tests).

# About

This package is maintained by Hugo from [Code with Hugo](https://codewithhugo.com) and [Alpine.js Weekly](https://alpinejs.codewithhugo.com/newsletter).

## Acknowledgments


Special thanks to:

- The developers behind
  - [ava](https://avajs.dev)
  - [meow](https://github.com/sindresorhus/meow#readme)
  - [node-fetch](https://github.com/node-fetch/node-fetch)
  - [purgecss](https://purgecss.com/)
  - [jsdoc](https://github.com/jsdoc/jsdoc)
  - [tiny-glob](https://github.com/terkelg/tiny-glob#readme)
  - [tsd-jsdoc](https://github.com/englercj/tsd-jsdoc)
  - [xo](https://github.com/xojs/xo#readme)

# LICENSE

Code is licensed under the [MIT License](./LICENSE).

