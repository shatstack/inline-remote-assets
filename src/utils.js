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

const fs = require('fs').promises;
const path = require('path');

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

module.exports = {
  matchRemoteResource,
  ensureWriteablePath
};
