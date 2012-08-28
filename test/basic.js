describe('basic test', function () {
  var proc
    , id = idgen()
    , logFile = '/tmp/benchmarx-' + id + '.log'

  process.once('exit', function () {
    proc && proc.kill();
  });

  it('benchmarks', function (done) {
    var args = [
      '--time', '4',
      '--wait', '1',
      '--paths', '/README.md',
      '--conf', './fixtures/conf.json',
      '--out', logFile,
      '--no-random',
      '--title', 'benchmarx test',
      'benchmarks/buffet-server.js'
    ];

    proc = execFile(utils.resolve(__dirname, '../bin/benchmarx.js'), args, {cwd: __dirname});
    proc.once('close', function (code) {
      done();
    });
  });

  it('looks good', function (done) {
    fs.readFile(logFile, 'utf8', function (err, log) {
      var regex = '^benchmarx test\n==============\n\n'
        + 'benchmarx\.js v' + pkgInfo.version.replace('.', '\\.') + '\n'
        + '.*?\n\n'
        + 'buffet-server@' + pkgInfo.devDependencies.buffet.replace('.', '\\.') + '\n\-+\n\n'
        + '\\*\\* SIEGE'
        + '.*?'
        + 'trans/sec'
        //+ 'Transactions:.*?'
        //+ '\n\n'

      console.log(regex);
      console.log(log);
      assert(log.match(new RegExp(regex)));
      done();
    });
  });
});