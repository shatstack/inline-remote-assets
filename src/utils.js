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

module.exports = {
  matchRemoteResource
};
