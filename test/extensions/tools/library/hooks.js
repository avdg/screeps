'use strict';

var assert = require('assert');
var simple = require('simple-mock');

var lib = require('../../../../extensions/tools/library/hooks');

describe('Library extensions: hooks', function() {
    it('Should call the right hooks', function() {
        global.AI = {
            extensions: {
                hooks: {
                    me: {
                        test: function() {},
                        fail: function() {}
                    },
                    you: {
                        hi: function() {},
                    }
                }
            }
        };

        var fn1 = simple.mock(AI.extensions.hooks.me, 'test');
        var fn2 = simple.mock(AI.extensions.hooks.me, 'fail');
        var fn3 = simple.mock(AI.extensions.hooks.you, 'hi');

        assert.deepEqual(lib.emit('test'), [undefined]);

        assert.equal(fn1.callCount, 1);
        assert.equal(fn2.callCount, 0);
        assert.equal(fn3.callCount, 0);

        assert.deepEqual(fn1.calls[0].args, []);
    });

    it('Should be able to pass parameters through emit', function() {
        global.AI = {
            extensions: {
                hooks: {
                    test: {
                        callHook: function() {}
                    }
                }
            }
        };

        var fn1 = simple.mock(AI.extensions.hooks.test, 'callHook');

        assert.deepEqual(lib.emit('callHook', 1, 2, 3), [undefined]);

        assert.equal(fn1.callCount, 1);
        assert.deepEqual(fn1.calls[0].args, [1, 2, 3]);
    });

    it('Should be able to return an array, containing the result of every call', function() {
        global.AI = {
            extensions: {
                hooks: {
                    test1: {
                        callHook: function() {
                            return "test";
                        }
                    },
                    test2: {
                        callHook: function() {
                            return "123";
                        }
                    }
                }
            }
        };
        var result = ["123", "test"];

        var fn1 = simple.mock(AI.extensions.hooks.test1, 'callHook');
        var fn2 = simple.mock(AI.extensions.hooks.test2, 'callHook');

        var output = lib.emit('callHook', 1, 2, 3);

        assert.equal(output.length, 2);

        for (var i in result) {
            var pos = output.indexOf(result[i]);
            if (pos > -1) {
                var previousLength = output.length; // Make sure we only cut 1 element
                output = output.slice(0, pos).concat(output.slice(pos + 1));
                assert.strictEqual(previousLength - output.length, 1);
            }
        }

        assert.equal(output.length, 0);
    });
});