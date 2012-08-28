var utils = require('../../lib/utils')

exports.name = 'node-static';
exports.version = require(utils.resolve(__dirname, '../..') + '/package.json').dependencies['node-static'];

exports.middleware = function (options) {
  var nodeStatic = require('node-static')
    , fileServer = new(nodeStatic.Server)(options.root)

  return fileServer.serve.bind(fileServer);
};