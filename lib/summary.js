var utils = require('./utils')

module.exports = function (results, options) {
  var items = []
    , high = 0

  options || (options = {});
  options.stars || (options.stars = 16);

  Object.keys(results).forEach(function (k) {
    var output = results[k];
    var item = {};
    item.mod = k;
    item.rps = parseFloat(output.match(/([\d\.]+) trans\/sec/)[1]);
    items.push(item);
    high = Math.max(item.rps, high);
  });

  items.sort(function (a, b) {
    if (a.rps < b.rps) return 1;
    if (a.rps > b.rps) return -1;
    return 0;
  });

  return 'SUMMARY\n-------\n\n' + items.reduce(function (prev, item, idx, arr) {
    var stars = Math.ceil((item.rps / high) * options.stars);

    return utils.format('%s%s%s%s (%s rps)\n',
      prev,
      utils.repeat('*', stars),
      utils.repeat(' ', options.stars - stars + 4),
      item.mod,
      item.rps
    );
  }, '');
};