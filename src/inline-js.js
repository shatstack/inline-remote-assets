const loadRemoteAsset = require('./load-remote-asset');
const {matchRemoteResource, urlsToAssets} = require('./utils');

const scriptRegex = /<script[^>]*>/gm;
const extractSrcRegex = /(?<=src=").*(?=")/gm;

/**
 *
 * @param {string} tag
 * @returns {string|null}
 */
function matchRemoteSrc(tag) {
  return matchRemoteResource(tag, extractSrcRegex);
}
/**
 * Inline JavaScript loaded from CDN/remote into HTML script directly
 * @param {string} html - HTML document string
 * @param {object} options
 * @param {number} options.maxSize - Maximum size of asset to be inlined (in bytes)
 * @returns {Promise<string>}
 */

async function inlineJs(html, options) {
  const scriptTags = html.match(scriptRegex);
  if (!scriptTags || scriptTags.length === 0) {
    console.warn('HTML did not contain any script tags');
    return html;
  }

  const scriptUrls = scriptTags
    .map((tag) => matchRemoteSrc(tag))
    .filter(Boolean);

  const assets = await Promise.all(
    scriptUrls.map(async (url) => {
      return {
        url,
        asset: await loadRemoteAsset(url)
      };
    })
  );

  const urlToAsset = urlsToAssets(assets);

  return html.replace(scriptRegex, (scriptTag) => {
    const src = matchRemoteSrc(scriptTag);
    if (!src) {
      return scriptTag;
    }

    const asset = urlToAsset[src];
    if (asset.size > options.maxSize) {
      return scriptTag;
    }

    // There should already be a closing `</script>` tag
    return `<script>${asset.value}`;
  });
}

module.exports = inlineJs;
