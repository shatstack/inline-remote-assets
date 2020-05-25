// @ts-check
const fs = require('fs').promises;
const fetch = require('node-fetch');

const inMemory = new Map();

/**
 * @property {Function} set
 * @property {Function} get
 */
const cache = {
  /**
   *
   * @param {string} key
   * @param {string} value
   * @return {Promise<{ size: number, value: string }>}
   */
  async set(key, value) {
    await fs.writeFile(key, value, 'utf8');
    const {size} = await fs.stat(key);
    inMemory.set(key, {
      size,
      value
    });
    return {size, value};
  },
  /**
   *
   * @param {string} key
   * @param {object} options
   * @param {string} options.cachePath
   * @returns {Promise<{ size: number, value: string }>}
   */
  async get(key, options) {
    let cachedVersion = inMemory.get(key);
    if (!cachedVersion) {
      // Not cached in memory
      try {
        const {size} = await fs.stat(key);
        const value = await fs.readFile(key, 'utf8');
        cachedVersion = {
          size,
          value
        };
      } catch (_) {
        // No cache for resource, init the directory, if it doesn't exist
        fs.mkdir(options.cachePath).catch(() => {});
      }
    }

    inMemory.set(key, cachedVersion);

    return cachedVersion;
  }
};

/**
 * Load & cache (to fs) remote stylesheets
 * @param {string} url - Stylesheet URL to load
 * @param {object} options
 * @param {boolean} options.noCache - Whether to use existing cache
 * @param {string} options.cachePath - Where to store the cache
 * @returns {Promise<{ size: number, value: string }>}
 */
async function loadRemoteAsset(url, options) {
  const {noCache, cachePath} = options;
  const assetCachePath = `${cachePath}/${Buffer.from(url).toString('base64')}`;
  // Cache enabled by default
  if (!noCache) {
    const cachedVersion = await cache.get(assetCachePath, options);
    if (cachedVersion) {
      return cachedVersion;
    }
  }

  // @ts-ignore
  const value = await fetch(url).then((response) => response.text());
  // Cache loaded resource & compute size
  const {size} = await cache.set(assetCachePath, value);

  return {value, size};
}

module.exports = loadRemoteAsset;
