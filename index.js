var once = require('once-component');

module.exports = function(queue, fn, cb) {
  (function nextFn(err) {
    var next = once(nextFn);

    // Guarantee async
    if((! queue.length) || err)
      return setTimeout(function() { cb(err || null); });

    var cur = queue.shift();
    try {
      fn(cur, next);
    } catch(e) {
      next(e);
    }
  })();
};