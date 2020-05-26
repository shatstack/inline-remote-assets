const PurgeCSS = require('purgecss').default;
const loadRemoteAsset = require('./load-remote-asset');
const {matchRemoteResource} = require('./utils');

const styleLinkRegex = /<link[^>]*rel="stylesheet"[^>]*>/gm;
const extractHrefRegex = /(?<=href=").*(?=")/gm;

/**
 *
 * @param {string} tag
 * @returns {string|null}
 */
function matchRemoteHref(tag) {
  return matchRemoteResource(tag, extractHrefRegex);
}

/**
 * Inline & purge CSS rules from CDN/remote includes into HTML
 * @param {string} html - HTML document string into which to inline remote asset
 * @param {object} [_]
 * @param {number} _.maxSize - Maximum size of asset to be inlined (in bytes)
 * @param {string} [_.output]
 * @returns {Promise<string>}
 */

async function inlineCss(html, _) {
  const linkTags = html.match(styleLinkRegex);

  if (!linkTags || linkTags.length === 0) {
    console.warn('HTML did not contain any link tags');
    return html;
  }

  const styleSheetUrls = linkTags
    .map((tag) => matchRemoteHref(tag))
    .filter(Boolean);

  const styleSheetContents = await Promise.all(
    styleSheetUrls.map(async (url) => {
      return {
        url,
        asset: await loadRemoteAsset(url, {
          cachePath: '.remote-asset-cache',
          noCache: false
        })
      };
    })
  );

  // @todo cache Purge output using `styleSheets.url` + HTML content
  const purgeResult = await new PurgeCSS().purge({
    defaultExtractor: (content) => content.match(/[\w-/:]+(?<!:)/g) || [],
    content: [
      {
        raw: html,
        extension: 'html'
      }
    ],
    css: styleSheetContents.map(({asset}) => ({
      raw: asset.value,
      extension: 'css'
    }))
  });

  // 4. create a "url" -> purgedCSS map
  const urlToCss = purgeResult.reduce((acc, {css}, i) => {
    const styleSheetUrl = styleSheetUrls[i];
    acc[styleSheetUrl] = css;
    return acc;
  }, {});

  // 5. replace <link> tags with correct CSS in <style> tags
  return html.replace(styleLinkRegex, (linkTag) => {
    // 5.1. find relevant CSS based on linkTag.match(extractHrefRegex)
    // & url -> CSS map
    const href = matchRemoteHref(linkTag);
    if (!href) {
      return linkTag;
    }

    const css = urlToCss[href];
    return `<style>${css}</style>`;
  });
}

module.exports = inlineCss;
