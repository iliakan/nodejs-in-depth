// first, don't touch require cache
module.exports = function() {
  var args = [].slice.call(arguments);
  // may need parent dir to look for resources at parent location
  // or to print its name (here)
  args.unshift(module.parent.filename);
  console.log.apply(console, args);
};

delete require.cache[module.id];