var execFile = require('child_process').execFile
  , utils = require('../utils')

module.exports = function (options, cb) {
  var baseUrl = 'http://127.0.0.1:' + options.port
    , url = options.paths.map(function (path) {
      return baseUrl + path;
    })[0]
    , args = ['-c', options.concurrency, '-t', options.time, url]

  var proc = execFile(utils.resolve(__dirname, '../../node_modules/.bin/slam'), args)
    , buf = ''

  function catchData (chunk) {
    options.stream.write(chunk);
    buf += chunk;
  }

  proc.stdout.on('data', catchData);
  proc.stderr.on('data', catchData);

  function parseOutput () {
    var matches = buf.match(/([\d\.]+) trans\/sec/);
    var info = {
      rps: matches ? parseFloat(matches[1]) : 0
    };
    return info;
  }

  proc.once('close', function (code) {
    if (code) proc.emit('error', new Error('ab exited with code ' + code));
    options.stream.write('\n');
    proc.emit('output', buf);
    proc.emit('info', parseOutput());
    proc.emit('done');
  });

  cb(null, proc);
};