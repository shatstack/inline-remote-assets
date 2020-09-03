const fs = require('fs').promises;
const pkg = require('../package.json');
const path = require('path');
const findCacheDir = require('find-cache-dir');

const cachePath = findCacheDir({name: pkg.name, create: true});
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
    const cacheFilePath = path.join(cachePath, key);
    await fs.writeFile(cacheFilePath, value, 'utf8');
    const {size} = await fs.stat(cacheFilePath);
    inMemory.set(key, {
      size,
      value
    });
    return {size, value};
  },
  /**
   *
   * @param {string} key
   * @returns {Promise<{ size: number, value: string }>}
   */
  async get(key) {
    let cachedVersion = inMemory.get(key);
    if (!cachedVersion) {
      // Not cached in memory
      try {
        const cacheFilePath = path.join(cachePath, key);
        const {size} = await fs.stat(cacheFilePath);
        const value = await fs.readFile(cacheFilePath, 'utf8');
        cachedVersion = {
          size,
          value
        };
      } catch {
        // No cache for resource, init the directory, if it doesn't exist
        fs.mkdir(cachePath).catch(() => {});
      }
    }

    inMemory.set(key, cachedVersion);

    return cachedVersion;
  }
};

module.exports = cache;
