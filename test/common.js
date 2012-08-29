assert = require('assert');

execFile = require('child_process').execFile;

spawn = require('child_process').spawn;

utils = require('../lib/utils');

idgen = require('idgen');

fs = require('fs');

pkgInfo = require(utils.resolve(__dirname, '..') + '/package.json');