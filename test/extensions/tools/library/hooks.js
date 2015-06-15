'use strict';

var assert = require('assert');
var simple = require('simple-mock');

var lib = require('../../../../extensions/tools/library/hooks');

describe('Library extensions: hooks', function() {
    AI.extensions.hooks = {
        me: {
            test: function() {},
            fail: function() {}
        },
        you: {
            hi: function() {},
        }
    };

    var fn1 = simple.mock(AI.extensions.hooks.me, 'test');
    var fn2 = simple.mock(AI.extensions.hooks.me, 'fail');
    var fn3 = simple.mock(AI.extensions.hooks.you, 'hi');

    assert.strictEqual(lib.emit('test'), undefined);

    assert.equal(fn1.callCount, 1);
    assert.equal(fn2.callCount, 0);
    assert.equal(fn3.callCount, 0);
});