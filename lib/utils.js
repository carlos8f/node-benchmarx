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