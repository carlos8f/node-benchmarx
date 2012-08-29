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

        mod.name || (mod.name = utils.basename(file, '.js'));
        var summaryKey = mod.name;

        mod.version || (mod.version = utils.version(file, mod.name));

        if (mod.version) {
          summaryKey += '@' + mod.version;
        }

        var header = summaryKey + '\n' + utils.repeat('-', summaryKey.length);
        log(header + '\n');

        function runAfterCooloff (port) {
          var opts = {
            name: mod.name,
            concurrency: options.concurrency,
            port: port,
            paths: options.path,
            stream: stream,
            time: options.time,
            out: options.out
          };
          setTimeout(function () {
            runner(opts, function (err, proc) {
              if (err) return onErr(err);

              proc.once('error', onErr);
              proc.once('info', function (info) {
                info.name = mod.name;
                results[summaryKey] = info;
              });
              proc.once('done', function () {
                if (typeof mod.close === 'function') {
                  mod.close();
                }
                cb();
              });
            });
          }, coolOff); // "cool off" between benchmarks

          coolOff = options.wait * 1000;
        }

        if (typeof mod.middleware === 'function') {
          middler(server)
            .removeAll()
            .add(mod.middleware(options.opts))
            .add(function (req, res) {
              res.end();
            });

          runAfterCooloff(port);
        }
        else if (typeof mod.listen === 'function') {
          mod.listen(options.opts, function (err, port) {
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