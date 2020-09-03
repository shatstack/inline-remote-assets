const {test} = require('uvu');
const assert = require('uvu/assert');
const {inlineJs} = require('../src/main');

const defaultOptions = {
  maxSize: 20000
};

const remoteInclude = `<script src="https://cdn.jsdelivr.net/npm/@shat/stylenames@v1.x.x/lib/index.umd.js"></script>`;

test('inlines modules smaller than passed "maxSize" option', async () => {
  assert.fixture(
    await inlineJs(remoteInclude, {maxSize: 20000}),
    `<script>!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):(e=e||self).stylenames=t()}(this,function(){function e(e){if(!e||"object"!=typeof e)return"";if(Array.isArray(e))return e.join(";")+";";for(var t="",o=0,n=Object.keys(e);o<n.length;o++){var f=n[o],r=e[f];if("string"!=typeof r)if("boolean"!=typeof r){if("object"==typeof r&&0!==r.length)for(var i=e[f],s=0,a=Object.keys(i);s<a.length;s++){var y=a[s];if("function"!=typeof i[y]&&i[y]||"function"==typeof i[y]&&i[y]()){t+=f+":"+y+";";break}}}else t+=f;else t+=f+":"+r+";"}return t.replace(/([a-z])([A-Z])/g,"$1-$2").replace(/[_\\s]/,"-").toLowerCase()}return window&&(window.styleNames=e),e});
//# sourceMappingURL=index.umd.js.map
</script>`
  );
});

test('keeps CDN tag for modules larger than "maxSize" option', async () => {
  assert.fixture(await inlineJs(remoteInclude, {maxSize: 10}), remoteInclude);
});

const relativeScriptInclude = `<script src="./reflect.js"></script>`;

test('keeps relative includes', async () => {
  assert.is(
    await inlineJs(relativeScriptInclude, defaultOptions),
    relativeScriptInclude
  );
});

const sampleInlineScript = `<script>console.log('hello world');</script>`;

test('keeps inline scripts', async () => {
  assert.is(
    await inlineJs(sampleInlineScript, defaultOptions),
    sampleInlineScript
  );
});

test.run();
