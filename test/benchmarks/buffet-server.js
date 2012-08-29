var execFile = require('child_process').execFile
  , utils = require('../../lib/utils')

exports.name = 'buffet-server';
exports.version = require(utils.resolve(__dirname, '../..') + '/package.json').devDependencies.buffet;

var buffet;

exports.listen = function (options, cb) {
  var port = utils.randomPort()

  buffet = execFile(utils.resolve(__dirname, '../../node_modules/.bin/buffet'), ['-p', port, '--no-log', '--no-watch'], {cwd: options.root})
  buffet.stderr.on('data', function (chunk) {
    if (chunk.toString().match(/listening/)) {
      cb(null, port);
    }
  });
};

exports.close = function () {
  buffet.kill();
};