var utils = require('../lib/utils')

exports.middleware = function (options) {
  return require('buffet')(options.root, {watch: false});
};