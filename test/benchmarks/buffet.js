var utils = require('../../lib/utils')

exports.name = 'buffet';
exports.version = require(utils.resolve(__dirname, '../..') + '/package.json').dependencies.buffet;

exports.middleware = function (options) {
  return require('buffet')(options.root);
};