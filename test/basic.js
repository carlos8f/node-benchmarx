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
      '--title', 'benchmarx test'
    ];

    proc = execFile(utils.resolve(__dirname, '../bin/benchmarx.js'), args, {cwd: __dirname});
    proc.once('close', function (code) {
      done();
    });
    proc.stdout.pipe(process.stdout);
    proc.stderr.pipe(process.stderr);
  });

  var output;
  it('can read the log', function (done) {
    fs.readFile(logFile, 'utf8', function (err, data) {
      output = data;
      assert.ifError(err);
      assert(output);
      done();
    });
  });

  it('can read the header', function () {
    var regex = '^benchmarx test\n==============\n\n'
      + 'benchmarx\.js v' + pkgInfo.version.replace('.', '\\.') + '\n'
      + '.*?\n\n'
      + 'buffet-server@' + pkgInfo.devDependencies.buffet.replace('.', '\\.') + '\n\-+\n\n'
      + '\\*\\* SIEGE'

    assert(output.match(new RegExp(regex)));
  });

  it('can read trans/sec', function () {
    var matches = output.match(/([\d\.]+) trans\/sec/);
    assert(matches);
    var speed = parseFloat(matches[1]);
    assert(speed > 0);
  });

  it('can read the summary', function () {
    var regex = 'SUMMARY\n-------\n\n'
      + '(\\*+ +buffet(\-server)?@'
      + pkgInfo.devDependencies.buffet.replace('.', '\\.')
      + ' \\([\\d\\.]+ rps\\)\n){2}'

    assert(output.match(new RegExp(regex)));
  });
});