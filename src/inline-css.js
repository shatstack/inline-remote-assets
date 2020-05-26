const PurgeCSS = require('purgecss').default;
const loadRemoteAsset = require('./load-remote-asset');
const {matchRemoteResource, digest, urlsToAssets} = require('./utils');
const cache = require('./cache');

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
 *
 * @param {string} html
 * @param {Array<{ url: string, asset: { value: string, size: number } }>} styleSheetContents
 * @returns {Promise<Array<{ url: string, asset: { value: string, size: number } }>>}
 */
async function purgeStyles(html, styleSheetContents) {
  const htmlDigest = digest(html);

  const cachedPurgedAssets = [];
  const assetsToPurge = [];

  /**
   * @param {string} url - URL of the stylesheet being digested
   * @returns {string}
   */
  const getStyleDigest = (url) => `${htmlDigest}${digest(url)}`;

  // Get cached assets
  for await (const {url, asset} of styleSheetContents) {
    const cached = await cache.get(getStyleDigest(url));
    if (cached) {
      cachedPurgedAssets.push({
        url,
        asset: cached
      });
    } else {
      assetsToPurge.push({url, asset});
    }
  }

  // Purge remaining assets
  const purgedStyles = await new PurgeCSS().purge({
    defaultExtractor: (content) => content.match(/[\w-/:]+(?<!:)/g) || [],
    content: [
      {
        raw: html,
        extension: 'html'
      }
    ],
    css: assetsToPurge.map(({asset}) => ({
      raw: asset.value,
      extension: 'css'
    }))
  });

  // Shape the purgedStyles
  let purgedAssets = purgedStyles.map(({css}, i) => {
    return {
      url: assetsToPurge[i].url,
      asset: {
        value: css,
        size: 0
      }
    };
  });

  // Go through again to cache our output & populate `size`.
  purgedAssets = await Promise.all(
    purgedAssets.map(async ({url, asset}) => {
      const {size} = await cache.set(getStyleDigest(url), asset.value);
      return {
        url,
        asset: {
          ...asset,
          size
        }
      };
    })
  );

  return [...cachedPurgedAssets, ...purgedAssets];
}

/**
 * Inline & purge CSS rules from CDN/remote includes into HTML
 * @param {string} html - HTML document string into which to inline remote asset
 * @param {object} options
 * @param {number} [options.maxSize]
 * @param {number} [options.cssMaxSize]
 * @returns {Promise<string>}
 */

async function inlineCss(html, options) {
  const maxSize = options.cssMaxSize || options.maxSize || 20000;
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
        asset: await loadRemoteAsset(url)
      };
    })
  );

  const purgedAssets = await purgeStyles(html, styleSheetContents);

  const urlToAsset = urlsToAssets(purgedAssets);

  return html.replace(styleLinkRegex, (linkTag) => {
    const href = matchRemoteHref(linkTag);
    if (!href) {
      return linkTag;
    }

    const asset = urlToAsset[href];
    if (asset.size > maxSize) {
      return linkTag;
    }

    return `<style>${asset.value}</style>`;
  });
}

module.exports = inlineCss;
