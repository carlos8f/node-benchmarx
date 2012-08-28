#!/usr/bin/env node

var program = require('commander')
  , utils = require('../lib/utils')
  , version = require(utils.resolve(__dirname, '../package.json')).version

function list (str) {
  return str.split(/ *, */);
}

function loadConf (path) {
  return require(utils.resolve(process.cwd(), path));
}

program
  .version(version)
  .usage('[options] [files...]')
  .option('-r, --runner <runner>', 'choose siege, ab, or node (default: siege)', 'siege')
  .option('-t, --time <seconds>', 'length of each benchmark (default: 30)', Number, 30)
  .option('-w, --wait <seconds>', 'wait between benchmarks (default: 10)', Number, 10)
  .option('-p, --paths <paths>', 'comma-separated paths to test (default: /)', list, ['/'])
  .option('-c, --conf <path>', 'path to a JSON file to load options (passed to benchmarks)', loadConf, {})
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
  if (program.out) program.stream.end();
  if (err) {
    console.error('Error: ' + err.message);
    process.exit(1);
  }
  process.exit();
});