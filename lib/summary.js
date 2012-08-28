var utils = require('./utils')

module.exports = function (results, options) {
  var items = []
    , high = 0
    , low = 1e5

  options || (options = {});
  options.stars || (options.stars = 5);

  Object.keys(results).forEach(function (k) {
    var output = results[k];
    var item = {};
    item.mod = k;
    item.rps = parseFloat(output.match(/([\d\.]+) trans\/sec/)[1]);
    items.push(item);
    high = Math.max(item.rps, high);
    low = Math.min(item.rps, low);
  });

  var variance = high - low
    , star = variance / options.stars

  items.sort(function (a, b) {
    if (a.rps < b.rps) return 1;
    if (a.rps > b.rps) return -1;
    return 0;
  });

  return 'SUMMARY\n-------\n\n' + items.reduce(function (prev, item, idx, arr) {
    var stars = Math.min(options.stars, Math.max(1, Math.round(item.rps / star)));

    return utils.format('%s%s%s %s (%s rps)\n',
      prev,
      utils.repeat('*', stars),
      utils.repeat(' ', options.stars - stars + 3),
      item.mod,
      item.rps
    );
  }, '');
};