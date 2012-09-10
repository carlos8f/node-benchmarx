node-benchmarx
==============

HTTP-based side-by-side benchmark framework

[![build status](https://secure.travis-ci.org/carlos8f/node-benchmarx.png)](http://travis-ci.org/carlos8f/node-benchmarx)

Idea
----

`benchmarx` automates your benchmark running/reporting, and supports `ab`,
`siege`, and [slam](https://github.com/carlos8f/slam) (a pure-node alternative).

Benchmark a server (implement a `listen()` method) or a middleware (implement a
`middleware` method), and easily create side-by-side reports by adding new files
to your `bench` folder.

Setup
-----

1. `npm install --save-dev benchmarx` in your project folder
2. Create one or more benchmark files (format described below), and put them in
   a `bench` or `benchmarks` folder
4. Add a `Makefile` [such as this](https://github.com/carlos8f/node-benchmarx/blob/master/Makefile)
5. Type `make bench`!

API
---

(see [examples here](https://github.com/carlos8f/node-benchmarx/tree/master/examples))

A benchmark file is a Node module which should export the following:

### Property: `name` (optional)

The name of the module/benchmark (for reporting). If not specified, the file's
basename will be used.

### Property: `version` (optional)

The version of the module/benchmark. If not specified, benchmarx will attempt
to find the version automatically (by finding a `package.json` for the module
called `name`)

### Method: `middleware(options)`

If you're benchmarking a middleware, have this function return your middleware
function.

Options passed to this function come from `benchmarx --opts <path>` (path to a
JSON file containing options).

#### Example

```javascript
exports.middleware = function (options) {
  return require('buffet')(options.root, {watch: false});
};
```

### Method: `listen(options, cb)`

If you're benchmarking a server, have this function call `cb(err, port)` or
`cb(err, "host:port")` to tell `benchmarx` which port the server is listening on.

#### Example

```javascript
exports.listen = function (options, cb) {
  var server = require('http').createServer(function (req, res) {
    res.end('hello world!');
  });
  server.listen(0, function () {
    cb(null, server.address().port);
  });
};
```

### Method: `close()`

If you're benchmarking a server, this function will be called once `benchmarx`
is done, so you can clean up your stuff.

#### Example

```javascript
exports.close = function () {
  server.close();
};
```

Usage
-----

```

  Usage: benchmarx.js [options] [files...]

  Options:

    -h, --help                 output usage information
    -V, --version              output the version number
    -r, --runner <runner>      choose slam, ab, or siege (default: slam)
    -c, --concurrency <num>    level of concurrency (default: 10)
    -t, --time <seconds>       length of each benchmark (default: 30)
    -w, --wait <seconds>       wait between benchmarks (default: 10)
    -p, --path <path(s)/file>  URL path(s) to test, can be comma-separated, or newline-separated file (default: /)
    --opts <path>              file path to a JSON file to load options (passed to benchmarks)
    -o, --out <outfile>        write results to a file
    --title <title>            title for the header
    --no-random                disable random benchmark order

```

Sample output
-------------

```
benchmarx.js v0.1.0
Tue Aug 28 2012 20:56:14 GMT-0700 (PDT)

buffet@~0.4.0
-------------


slam v1.0.2
Tue Aug 28 2012 20:56:14 GMT-0700 (PDT)

slamming http://127.0.0.1:36919/README.md x5 for 2s...

Transactions:                 13116 hits
Availability:                100.00 %
Elapsed time:                  2.02 secs
Data transferred:              4.30 MB
Response time:                 0.00 secs
Transaction rate:           6486.64 trans/sec
Throughput:                    2.12 MB/sec
Concurrency:                   4.26 
Successful transactions:      13116 
Failed transactions:              0 
Longest transaction:           0.11 
Shortest transaction:          0.00 


buffet-server@~0.4.0
--------------------


slam v1.0.2
Tue Aug 28 2012 20:56:18 GMT-0700 (PDT)

slamming http://127.0.0.1:27629/README.md x5 for 2s...

Transactions:                 15551 hits
Availability:                100.00 %
Elapsed time:                  2.21 secs
Data transferred:              5.10 MB
Response time:                 0.00 secs
Transaction rate:           7008.11 trans/sec
Throughput:                    2.29 MB/sec
Concurrency:                   2.94 
Successful transactions:      15551 
Failed transactions:              0 
Longest transaction:           0.21 
Shortest transaction:          0.00 


SUMMARY
-------

****************  buffet-server (7008.11 rps)
***************   buffet (6486.64 rps)
```

- - -

### Developed by [Terra Eclipse](http://www.terraeclipse.com)
Terra Eclipse, Inc. is a nationally recognized political technology and
strategy firm located in Aptos, CA and Washington, D.C.

- - -

### License: MIT

- Copyright (C) 2012 Carlos Rodriguez (http://s8f.org/)
- Copyright (C) 2012 Terra Eclipse, Inc. (http://www.terraeclipse.com/)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is furnished
to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.