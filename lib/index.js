var server = require('http').createServer()
  , middler = require('middler')
  , async = require('async')
  , summary = require('./summary')
  , utils = require('./utils')

module.exports = function (options, done) {
  var stream = options.stream || process.stdout;

  function log (str) {
    stream.write(str + '\n');
  }

  if (options.title) {
    var header = options.title;
    header += '\n' + utils.repeat('=', header.length);
    log(header);
  }

  log(utils.format('\n%s v%s\n%s\n', options.name, options.version, new Date()));

  server.listen(0, function () {
    var port = server.address().port;

    if (options.random) {
      // randomize order
      options.args.sort(function () { return 0.5 - Math.random() });
    }

    var results = {}
      , coolOff = 0
      , runner = require('./runners/' + options.runner)

    var tasks = options.args.map(function (file) {
      return function (cb) {
        var mod = require(utils.resolve(file));

        function onErr (err) {
          log('Error: ' + err.message, '\n');
          cb();
        }

        var summaryKey = mod.name;
        if (mod.version) summaryKey += '@' + mod.version;
        var header = summaryKey + '\n' + utils.repeat('-', summaryKey.length);
        log(header + '\n');

        function runAfterCooloff (port) {
          setTimeout(function () {
            runner({name: mod.name, port: port, paths: options.paths, time: options.time}, function (err, proc) {
              if (err) return onErr(err);

              var output = '';

              function catchOutput (chunk) {
                stream.write(chunk);
                output += chunk;
              }

              if (options.runner === 'ab') {
                proc.stdout.on('data', catchOutput);
              }
              proc.stderr.on('data', catchOutput);

              proc.once('close', function (code) {
                if (code) return onErr(new Error('runner exited with code ' + code));
                results[summaryKey] = output;
                if (typeof mod.close === 'function') mod.close();
                cb();
              });
            });
          }, coolOff); // "cool off" between benchmarks

          coolOff = options.wait * 1000;
        }

        if (typeof mod.middleware === 'function') {
          middler(server)
            .removeAll()
            .add(mod.middleware(options.conf))

          runAfterCooloff(port);
        }
        else if (typeof mod.listen === 'function') {
          mod.listen(options.conf, function (err, port) {
            if (err) return onErr(err);
            runAfterCooloff(port);
          });
        }
        else {
          log('\nskipped!\n\n');
        }
      };
    });

    async.series(tasks, function (err) {
      if (err) return done(err);

      log(summary(results));

      server.once('close', done);
      server.close();
    });
  });
};