var utils = require('../../lib/utils')

exports.name = 'buffet';
exports.version = require(utils.resolve(__dirname, '../..') + '/package.json').devDependencies.buffet;

exports.middleware = function (options) {
  return require('buffet')(options.root, {watch: false});
};