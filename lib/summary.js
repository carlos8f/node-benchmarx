var utils = require('./utils')

module.exports = function (results, options) {
  options || (options = {});
  options.stars || (options.stars = 16);

  var items = Object.keys(results).reduce(function (prev, k) {
    return prev.concat(results[k]);
  }, []);

  var high = items.reduce(function (prev, item) {
    return Math.max(item.rps, prev);
  }, 0);

  items.sort(function (a, b) {
    if (a.rps < b.rps) return 1;
    if (a.rps > b.rps) return -1;
    return 0;
  });

  return 'SUMMARY\n-------\n\n' + items.reduce(function (prev, item) {
    var stars = Math.ceil((item.rps / high) * options.stars);

    return utils.format('%s%s%s%s (%s rps)\n',
      prev,
      utils.repeat('*', stars),
      utils.repeat(' ', options.stars - stars + 2),
      item.name,
      item.rps
    );
  }, '');
};