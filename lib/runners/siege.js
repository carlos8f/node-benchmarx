var spawn = require('child_process').spawn
  , idgen = require('idgen')
  , fs = require('fs')

module.exports = function (options, cb) {
  var id = options.name + '-' + idgen()
    , prefix = '/tmp/benchmarx-' + id
    , logFilePath = prefix + '.log'
    , urlFilePath = prefix + '-urls.txt'
    , baseUrl = 'http://127.0.0.1:' + options.port
    , args = ['-b', '-t', options.time + 's', '--log=' + logFilePath, '-f', urlFilePath]
    , urls = options.paths.map(function (path) {
      return baseUrl + path;
    })

  fs.writeFile(urlFilePath, urls.join('\n'), function (err) {
    if (err) return cb(err);
    var siege = spawn('siege', args);
    siege.once('close', fs.unlink.bind(fs, urlFilePath));
    cb(null, siege);
  });
};