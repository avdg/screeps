'use strict';

if (!Array.prototype.findIndex) {
  Array.prototype.findIndex = function(predicate) {
    if (this === null) {
      throw new TypeError('Array.prototype.findIndex called on null or undefined');
    }
    if (typeof predicate !== 'function') {
      throw new TypeError('predicate must be a function');
    }
    var list = Object(this);
    var length = list.length >>> 0;
    var thisArg = arguments[1];
    var value;

    for (var i = 0; i < length; i++) {
      value = list[i];
      if (predicate.call(thisArg, value, i, list)) {
        return i;
      }
    }
    return -1;
  };
}

var assert = require('assert');

var _ = require("lodash");
var simple = require('simple-mock');

var lib = _.merge(
    require('../../../../extensions/tools/library/commands'),
    require('../../../../extensions/tools/library/utils')
);
var hookDeathChecker = require('../../../../extensions/tools/hooks/deathChecker');

function reset() {
    require('../../../../lib/mocks/gameStateGlobals')();
}

function eliminateDuplicates(a, b, e) {
    var filter = function(e) {
        var compare = function(x, y) {
            if (typeof x !== "object") {
                return x === y;
            }

            if (Array.isArray(x)) {
                if (!Array.isArray(y)) {
                    return false;
                }

                for (var p = 0; p < x.length; p++) {
                    if (!compare(x[p], y[p])) {
                        return false;
                    }
                }

                return true;
            }

            var xKeys = Object.keys(x);
            var yKeys = Object.keys(y);
            if (xKeys.length !== yKeys.length) {
                return false;
            }

            xKeys.sort();
            yKeys.sort();

            for (var i = 0; i < 0; i++) {
                if (xKeys[i] !== yKeys[i]) {
                    return false;
                }

                if (!compare(x[xKeys[i]], y[xKeys[i]])) {
                    return false;
                }
            }

            return true;
        };

        return function(i) {
            return compare(i, e);
        };
    };
    for (var i in b) {
        var j = a.findIndex(filter(b[i]));

        if (j > -1) {
            a.splice(j, 1);
        } else {
            e(b[i], a);
        }
    }

    return b;
}

describe('Hook extensions: deathChecker', function() {
    beforeEach(reset);

    it('Should be able to collect creeps it cannot find', function() {
        Game.creeps = {
            surviving: {}
        };

        Memory.creeps = {
            Foo: {},
            bar: {
                role: 'medic'
            },
            guard007: {
                role: 'guard'
            },
            builders: {
                role: 'builder'
            },
            surviving: {
                role: 'survivor'
            }
        };

        AI.settings = {
            deathChecker: {
                ignore: ['builder'],
                copy: ['guard', 'survivor'],
                copyPriority: ['medic']
            }
        };

        AI.extensions.commands.creepClone = {
            native: function() {}
        };

        var fn1 = simple.mock(AI.extensions.commands.creepClone, 'native');
        var fn2 = simple.mock(Game, 'notify');

        var fail = function(unfound, items) {
            console.log(items);
            assert.fail(undefined, unfound, "Value " + JSON.stringify(unfound) + " not found");
        };

        var expectedDeaths = ['Foo', 'bar', 'guard007', 'builders'];
        var expectedBuffer = [
            ["Hook deathChecker: Found dead creep bar. Copying to priority queue..."],
            ["Hook deathChecker: Found dead creep Foo. Deleting..."],
            ["Hook deathChecker: Found dead creep guard007. Copying to queue..."],
            ["Hook deathChecker: Found dead creep builders. Deleting..."]
        ];
        var expectedCalls = [
            ["creepClone", {
                role: "medic",
                memory: {
                    role: "medic",
                }
            }, true],
            ["creepClone", {
                role: "guard",
                memory: {
                    role: "guard",
                }
            }, false]
        ];
        var expectedNotifications = [
            ["Found dead creep Foo without role. Deleting..."]
        ];
        var buffer = [];
        var calls = [];
        var notifications = [];

        hookDeathChecker.test.removeQueue = [];
        lib.bufferConsole(
            hookDeathChecker.preController,
            buffer
        );

        assert.deepEqual(hookDeathChecker.test.removeQueue, expectedDeaths);

        for (let i = 0; i < fn1.calls.length; i++) {
            calls.push(fn1.calls[i].args);
        }
        for (let i = 0; i < fn2.calls.length; i++) {
            notifications.push(fn2.calls[i].args);
        }

        assert.strictEqual(fn2.callCount, expectedNotifications.length);

        eliminateDuplicates(expectedCalls, calls, fail);
        eliminateDuplicates(expectedBuffer, buffer, fail);
        eliminateDuplicates(expectedNotifications, notifications, fail);

        assert.deepEqual(expectedBuffer, []);
        assert.deepEqual(expectedCalls, []);

        assert.strictEqual(Memory.creeps.bar.copyOnDeath, "ignore");
        assert.strictEqual(Memory.creeps.guard007.copyOnDeath, "ignore");
        assert.strictEqual(Memory.creeps.Foo.copyOnDeath, undefined);
        assert.strictEqual(Memory.creeps.builders.copyOnDeath, undefined);
        assert.strictEqual(Memory.creeps.surviving.copyOnDeath, undefined);
    });

    it('Should listen to copyOnDeath in memory if available', function() {
        Game.creeps = {}; // All death, doom has happened
        Memory.creeps = {
            helpMe: {
                copyOnDeath: "ignore",
                role: 'soldier'
            },
            luckyOne: {
                copyOnDeath: "copy",
                role: 'guard'
            }
        };

        AI.settings = {
            deathChecker: {
                ignore: ['guard'],
                copy: [],
                copyPriority: ['soldier']
            }
        };

        AI.extensions.commands.creepClone = {
            native: function() {}
        };
        var fn = simple.mock(AI.extensions.commands.creepClone, 'native');
        var fail = function(unfound, items) {
            console.log(items);
            assert.fail(undefined, unfound, "Value " + JSON.stringify(unfound) + " not found");
        };

        var expectedDeaths = ['helpMe', 'luckyOne'];
        var expectedBuffer = [
            ['Hook deathChecker: Found dead creep helpMe. Deleting...'],
            ['Hook deathChecker: Found dead creep luckyOne. Copying to queue...']
        ];

        var expectedCalls = [
            ["creepClone", {
                role: "guard",
                memory: {
                    copyOnDeath: "copy",
                    role: "guard",
                }
            }, false]
        ];
        var buffer = [];

        hookDeathChecker.test.removeQueue = [];
        lib.bufferConsole(
            hookDeathChecker.preController,
            buffer
        );

        assert.deepEqual(hookDeathChecker.test.removeQueue, expectedDeaths);

        var calls = [];
        for (var i = 0; i < fn.calls.length; i++) {
            calls.push(fn.calls[i].args);
        }
        eliminateDuplicates(expectedCalls, calls, fail);
        eliminateDuplicates(expectedBuffer, buffer, fail);

        assert.deepEqual(expectedBuffer, []);
        assert.deepEqual(expectedCalls, []);

        assert.strictEqual(Memory.creeps.helpMe.copyOnDeath, "ignore");
        assert.strictEqual(Memory.creeps.luckyOne.copyOnDeath, "ignore");
    });

    it('Should remove creep memory marked for removal', function() {
        hookDeathChecker.test.removeQueue = ['foo', 'bar', 'bai'];
        Memory.creeps = {
            foo: {},
            bar: {},
            hai: {},
            bai: {},
            hey: {}
        };

        hookDeathChecker.postController();

        assert.deepEqual(Memory.creeps, {
            hai: {},
            hey: {}
        });
    });
});