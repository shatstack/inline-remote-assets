const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

/**
 *
 * @param {string} tag
 * @param {RegExp} resourceLocationRegex
 * @returns {string|null}
 */

function matchRemoteResource(tag, resourceLocationRegex) {
  const locationMatches = tag.match(resourceLocationRegex);
  if (!locationMatches) return null;
  const [location] = locationMatches;
  return location.startsWith('http') ? location : null;
}

/**
 *
 * @param {string} string - string to digest
 * @returns {string}
 */
function digest(string) {
  return crypto.createHash('sha256').update(string).digest('hex');
}

/**
 * @param {string} p - Path to check
 */
const isPathWriteable = async (p) =>
  fs
    .stat(p)
    .then(() => true)
    .catch(() => false);

/**
 *
 * @param {string} filePath
 * @return {Promise<void>}
 */
async function ensureWriteablePath(filePath) {
  if (!(await isPathWriteable(filePath))) {
    await fs.mkdir(path.dirname(filePath), {recursive: true});
  }
}

/**
 * @param {Array<{ url: string, asset: object }>} urlsWithAssets
 * @returns {Record<string, object>}
 */
function urlsToAssets(urlsWithAssets) {
  return urlsWithAssets.reduce((acc, {url, asset}) => {
    acc[url] = asset;
    return acc;
  }, {});
}

module.exports = {
  matchRemoteResource,
  digest,
  ensureWriteablePath,
  urlsToAssets
};
