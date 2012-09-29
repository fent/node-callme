var EventEmitter = require('events').EventEmitter;


module.exports = function callme(callback, timeout) {
  var called = false;
  var sameEventLoop = true;
  var err;

  // make sure the callback is not called in the same event loop
  process.nextTick(function updateEventLoop() {
    sameEventLoop = false;
  });

  // set a timeout to check the callback is called eventually
  timeout = ~~timeout;
  if (timeout) {
    var tid = setTimeout(function timedOut() {
      err = new Error('function timed out');
      wrapper.emit('error', err);
    }, timeout);
  }

  var wrapper = function wrapper() {
    clearTimeout(tid);

    if (sameEventLoop) {
      err = new Error('callback must not be called in the same event loop');
      return wrapper.emit('error', err);
    }

    if (called) {
      err = new Error('callback must be called only once');
      return wrapper.emit('error', err);
    }
    called = true;

    if (typeof callback === 'function') {
      callback.apply(this, arguments);
    }
  };

  // inherit from EventEmitter
  for (var key in EventEmitter.prototype) {
    if (EventEmitter.prototype.hasOwnProperty(key)) {
      wrapper[key] = EventEmitter.prototype[key];
    }
  }

  EventEmitter.call(wrapper);

  return wrapper;
};
