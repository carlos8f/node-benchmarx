var utils = require('../../lib/utils')

exports.name = 'send';
exports.version = require(utils.resolve(__dirname, '../..') + '/package.json').dependencies.send;

exports.middleware = function (options) {
  return function (req, res, next) {
    require('send')(req, req.url)
      .root(options.root)
      .pipe(res);
  };
};