assert = require('assert');

execFile = require('child_process').execFile;

utils = require('../lib/utils');

idgen = require('idgen');

fs = require('fs');

pkgInfo = require(utils.resolve(__dirname, '..') + '/package.json');