describe('slam', function () {
  var proc
    , id = idgen()
    , logFile = '/tmp/benchmarx-' + id + '.log'

  process.once('exit', function () {
    proc && proc.kill();
  });

  it('benchmarks', function (done) {
    var args = [
      '--runner', 'slam',
      '--concurrency', 1,
      '--time', 2,
      '--wait', 1,
      '--path', '/README.md',
      '--opts', './fixtures/conf.json',
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

    assert(output.match(new RegExp(regex)));
  });

  it('can read trans/sec', function () {
    var matches = output.match(/([\d\.]+) trans\/sec/);
    assert(matches);
    var speed = parseFloat(matches[1]);
    assert(speed > 0);
  });

  it('can read the summary', function () {
    assert(output.match(/SUMMARY\n-------\n\n/));
    assert(output.match(/\*+ +buffet(\-server)? \([\d\.]+ rps\)/));
    assert(output.match(new RegExp(pkgInfo.devDependencies.buffet.replace('.', '\\.'))));

    var match = output.match(/([\d\.]+) rps\)/);
    assert(match);
    var rps = parseFloat(match[1]);
    assert(rps > 0);
  });
});