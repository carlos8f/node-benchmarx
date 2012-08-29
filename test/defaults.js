describe('slam', function () {
  var proc
    , output = ''

  process.once('exit', function () {
    proc && proc.kill();
  });

  it('benchmarks', function (done) {
    proc = spawn('make', ['bench'], {cwd: utils.resolve(__dirname, '..')});
    proc.once('close', function (code) {
      done();
    });
    proc.stdout.on('data', function (chunk) {
      output += chunk;
    });
    proc.stderr.on('data', function (chunk) {
      output += chunk;
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