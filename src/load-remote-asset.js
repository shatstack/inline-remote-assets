const fetch = require('node-fetch');
const cache = require('./cache');
const {digest} = require('./utils');

/**
 * Load & cache (to fs) remote stylesheets
 * @param {string} url - Stylesheet URL to load
 * @returns {Promise<{ size: number, value: string }>}
 */
async function loadRemoteAsset(url) {
  const assetKey = digest(url);

  const cachedVersion = await cache.get(assetKey);
  if (cachedVersion) {
    return cachedVersion;
  }

  // @ts-ignore
  const value = await fetch(url).then((response) => response.text());
  // Cache loaded resource & compute size
  const {size} = await cache.set(assetKey, value);

  return {value, size};
}

module.exports = loadRemoteAsset;
