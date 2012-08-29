var spawn = require('child_process').spawn
  , idgen = require('idgen')
  , fs = require('fs')

module.exports = function (options, cb) {
  var id = options.name + '-' + idgen()
    , prefix = '/tmp/benchmarx-' + id
    , logFilePath = prefix + '.log'
    , urlFilePath = prefix + '-urls.txt'
    , baseUrl = 'http://127.0.0.1:' + options.port
    , args = ['-c', options.concurrency, '-b', '-t', options.time + 's', '--log=' + logFilePath, '-f', urlFilePath]
    , urls = options.paths.map(function (path) {
      return baseUrl + path;
    })

  fs.writeFile(urlFilePath, urls.join('\n'), function (err) {
    if (err) return cb(err);
    var proc = spawn('siege', args)
      , buf = ''

    proc.stderr.on('data', function (chunk) {
      options.stream.write(chunk);
      buf += chunk;
    });

    function parseOutput () {
      var matches = buf.match(/([\d\.]+) trans\/sec/);
      var info = {
        rps: matches ? parseFloat(matches[1]) : 0
      };
      return info;
    }

    proc.once('close', function (code) {
      fs.unlink.bind(fs, urlFilePath);
      if (code) proc.emit('error', new Error('siege exited with code ' + code));
      proc.emit('output', buf);
      proc.emit('info', parseOutput());
      proc.emit('done');
    });

    cb(null, proc);
  });
};