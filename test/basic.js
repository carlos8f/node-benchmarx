describe('basic test', function () {
  var proc
    , id = idgen()
    , logFile = '/tmp/benchmarx-' + id + '.log'

  it('benchmarks', function (done) {
    var args = [
      '--time', '2',
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
  });

  it('looks good', function (done) {
    fs.readFile(logFile, 'utf8', function (err, log) {
      console.log(log);
      done();
    });
  });
});