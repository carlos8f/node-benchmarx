#!/usr/bin/env node

var program = require('commander')
  , utils = require('../lib/utils')
  , version = require(utils.resolve(__dirname, '../package.json')).version
  , existsSync = require('fs').existsSync
  , readFileSync = require('fs').readFileSync

function paths (str) {
  if (existsSync(str)) {
    str = readFileSync(str, 'utf8');
  }
  var paths = {};
  return str.split(/\r?\n| *, */).map(function (path) {
    path = path.replace(/\s+/, '');
    return path[0] === '/' ? path : '/' + path;
  }).filter(function (path) {
    // De-dupe
    if (paths[path]) return false;
    return paths[path] = true;
  });
}

function loadOpts (path) {
  return require(utils.resolve(path));
}

program
  .version(version)
  .usage('[options] [files...]')
  .option('-r, --runner <runner>', 'choose slam, ab, or siege (default: slam)', 'slam')
  .option('-c, --concurrency <num>', 'level of concurrency (default: 10)', Number, 10)
  .option('-t, --time <seconds>', 'length of each benchmark (default: 30)', Number, 30)
  .option('-w, --wait <seconds>', 'wait between benchmarks (default: 10)', Number, 10)
  .option('-p, --path <path(s)/file>', 'URL path(s) to test, can be comma-separated, or newline-separated file (default: /)', paths, ['/'])
  .option('--opts <path>', 'file path to a JSON file to load options (passed to benchmarks)', loadOpts, {})
  .option('-o, --out <outfile>', 'write results to a file')
  .option('--title <title>', 'title for the header')
  .option('--no-random', 'disable random benchmark order')
  .parse(process.argv)

if (!program.args.length) {
  program.args = ['bench*/*.js'];
}
if (program.args.length === 1 && program.args[0].indexOf('*') !== -1) {
  // resolve a glob.
  program.args = require('glob').sync(program.args[0]);
}

program.version = version;

if (program.out) {
  program.stream = require('fs').createWriteStream(program.out);
}

require('../')(program, function (err) {
  if (err) {
    console.error('Error: ' + err.message);
    process.exit(1);
  }
  setTimeout(process.exit, 100);
});