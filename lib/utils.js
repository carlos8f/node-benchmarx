var witwip = require('witwip');

exports.randomPort = function randomPort () {
  return Math.round((Math.random() * 2e4) + 2e4);
};

exports.repeat = function repeat (c, len) {
  var ret = '';
  while (ret.length < len) ret += c;
  return ret;
};

exports.format = require('util').format;

exports.basename = require('path').basename;

exports.resolve = require('path').resolve;

exports.existsSync = require('fs').existsSync;

exports.version = function (base, name) {
  var pkgPath;
  base = exports.resolve(base);
  try {
    // Try a package.json for name
    pkgPath = witwip(base, name);
  }
  catch (e) {
    // Fall back to the nearest one
    pkgPath = witwip(base);
  }
  if (pkgPath) {
    pkgInfo = require(pkgPath);
    if (pkgInfo.name === name) {
      return pkgInfo.version;
    }
  }
};