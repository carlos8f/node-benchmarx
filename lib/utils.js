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

exports.version = function (base, mod) {
  var pkgPath = witwip(exports.resolve(base), mod);
  if (pkgPath) {
    return require(pkgPath).version;
  }
};