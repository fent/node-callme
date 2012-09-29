var callme = require('..')
  , assert = require('assert')
  ;


describe('Give an undefined callback', function() {
  it('Should have no trouble', function(done) {
    var callback = callme();
    process.nextTick(function() {
      callback();
      done();
    });
  });
});

describe('Call the callback more than once', function() {
  it('Should throw', function(done) {
    var callback = callme(function() {});

    process.nextTick(function() {
      assert.throws(function() {
        callback();
        callback();
        callback();
      }, /callback must be called only once/);

      done();
    });
  });

  it('Should emit an `error` event', function(done) {
    var callback = callme(function() {});

    callback.once('error', function(err) {
      assert(/callback must be called only once/.test(err.message));
      done();
    });

    process.nextTick(function() {
      callback();
      callback();
    });
  });
});

describe('Call the callback in the same event loop', function() {
  it('Should throw', function() {
    var callback = callme(function() {});

    assert.throws(function() {
      callback();
    }, /callback must not be called in the same event loop/);
  });

  it('Should emit an `error` event', function(done) {
    var callback = callme(function() {});

    callback.once('error', function(err) {
      assert(/callback must not be called in the same event loop/.test(err.message));
      done();
    });

    callback();
  });
});

describe('Never call the callback', function() {
  it('Times out', function(done) {
    var callback = callme(function() {}, 30);

    callback.on('error', function(err) {
      assert(/function timed out/.test(err.message));
      done();
    });
  });
});

describe('Call the callback correctly and with arguments', function() {
  it('Gets the arguments and context', function(done) {
    var context = { hello: 'world' };
    var callback = callme(function(a, b) {
      assert.equal(this, context);
      assert.equal(a, 4);
      assert.equal(b, 2);
      done();
    });

    process.nextTick(callback.bind(context, 4, 2));
  });
});
