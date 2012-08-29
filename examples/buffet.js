exports.middleware = function (options) {
  return require('buffet')(options.root, {watch: false});
};