var spawn = require('child_process').spawn

module.exports = function (options, cb) {
  var baseUrl = 'http://127.0.0.1:' + options.port
    , url = options.paths.map(function (path) {
      return baseUrl + path;
    })[0]
    , args = ['-c', '15', '-t', options.time, '-r', url]

  var ab = spawn('ab', args);
  cb(null, ab);
};