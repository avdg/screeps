'use strict';

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
    for (var i in b) {
        var j = _.findIndex(a, b[i]);

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

        var fn = simple.mock(AI.extensions.commands.creepClone, 'native');
        var fail = function(unfound, items) {
            console.log(items);
            assert.fail(undefined, unfound, "Value " + JSON.stringify(unfound) + " not found");
        };

        var expectedDeaths = ['bar', 'guard007', 'builders'];
        var expectedBuffer = [
            ["Hook deathChecker: Found dead creep bar. Copying to priority queue..."],
            ["Hook deathChecker: Found dead creep Foo. Dunno what to do..."],
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