# node-callme [![Build Status](https://secure.travis-ci.org/fent/node-callme.png)](http://travis-ci.org/fent/node-callme)

Hey I just met you, and this is crazy, but here's my callback, so definitely call it once, and once only.

This tiny module is meant to help debug pesky asynchronous code by making sure your callbacks are called just once. It also checks if the given callback is undefined or if it's called in the same event loop.

This is meant to be used during testing, not production code. But could be used to help debug.


# Usage

```js
var callme = require('callme');

function asyncMethod(a, b, callback) {
  callback = callme(callback);

  someIO(a, b, function(err, result) {
    if (err) callback(err);
    
    result = permuteTheResult(result);

    // this will throw if there is an error since it will be
    // the second time the callback is called.
    // a `return` was forgotten on the error check above.
    callback(err, result);
  });
}
```

The `callme` function returned is also an instance of `EventEmitter`. If you prefer to listen to the `error` event instead, you can do so.

```js
function asyncMethod(a, b, callback) {
  callback = callme(callback);
  callback.on('error', function(err) {
    // do something with `err`
  });

  someIO(a, b, function() {
    // etc
  });
}
```

It also supports a `timeout` option, make sure your callbacks are definitely called.

```js
function asyncMethod(a, b, callback) {
  callback = callme(callback, 2000); // set timeout to 2 seconds

  callback.on('error', function(err) {
    // this will fire in 2 seconds since `callback` is never called
  });
}
```


# Install

    npm install callme


# Tests
Tests are written with [mocha](http://visionmedia.github.com/mocha/)

```bash
npm test
```

# License
MIT
