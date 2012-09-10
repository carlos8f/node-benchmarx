var spawn = require('child_process').spawn

module.exports = function (options, cb) {
  var baseUrl = 'http://' + options.host + ':' + options.port
    , url = options.paths.map(function (path) {
      return baseUrl + path;
    })[0]
    , args = ['-c', options.concurrency, '-v', 0, '-d', '-S', '-t', options.time, '-r', url]

  var proc = spawn('ab', args)
    , buf = '';

  function catchData (chunk) {
    options.stream.write(chunk);
    buf += chunk;
  }

  proc.stdout.on('data', catchData);
  proc.stderr.on('data', catchData);

  function parseOutput () {
    var matches = buf.match(/([\d\.]+) \[#\/sec\]/);
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