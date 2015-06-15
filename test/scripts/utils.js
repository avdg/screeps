'use strict';

var assert = require('assert');

var generics = require('../../scripts/_generics.js');
var utils = require('../../scripts/_utils');

function reset() {
    require('../../lib/mocks/gameStateStart')();
}

function includeGenerated() {
    assert.equal(typeof AI === "object" && AI.extensions === "object", false);

    require('../../lib/mocks/deploy/_generated.js')();
}

describe("Scripts: _utils", function() {
    beforeEach(reset);

    describe('exec', function() {
        beforeEach(includeGenerated);

        it('Should fail when no arguments are passed', function() {
            var executeWithoutParameters = function() {
                utils.exec();
            };

            var errorValidator = function(e) {
                return e instanceof Error &&
                    e.message === "Expected at least 1 parameter to execute a function";
            };

            assert.throws(executeWithoutParameters, errorValidator);
        });

        it('Should fail when the requested command isn\'t available', function() {
            var buffer = [];
            var executeUnavailableCommand = function() {
                generics.bufferConsole(utils.exec('notAvailable'), buffer);
            };
            var errorValidator = function(e) {
                return e instanceof Error &&
                    e.message === "Command notAvailable doesn't exist";
            };

            assert.throws(executeUnavailableCommand, errorValidator);
            assert.deepEqual(buffer, []);
        });

        it('Should fail when the requested command doesn\'t have a native function', function() {
            var buffer = [];
            var executeNativelessCommand = function() {
                generics.bufferConsole(utils.exec('test'), buffer);
            };
            var errorValidator = function(e) {
                return e instanceof Error &&
                    e.message === "Can't execute command test natively";
            };

            assert.throws(executeNativelessCommand, errorValidator);
            assert.deepEqual(buffer, []);
        });

        it('Should execute the native function when available', function() {
            var buffer = [];

            assert.equal(
                generics.bufferConsole(
                    function() {
                        utils.exec('testWithNative');
                    },
                    buffer
                ),
                undefined
            );
            assert.deepEqual(buffer, [["Hello world"]]);
        });
    });

    describe('getTmp', function() {
        beforeEach(includeGenerated);

        it('Should return an empty object', function() {
            assert.deepEqual(utils.getTmp(), {});
        });

        it('Should remember set values', function() {
            var tmp = utils.getTmp();
            assert.deepEqual(tmp, {});

            tmp.foo = "bar";
            assert.deepEqual(utils.getTmp(), tmp);
            assert.deepEqual(utils.getTmp(), {foo: "bar"});
        });

        it('Should be empty on the next round', function() {
            assert.deepEqual(utils.getTmp(), {});
        });
    });

    describe('dontRepeat', function() {
        it('Should return true if message is unique', function() {
            assert.strictEqual(utils.dontRepeat('Spam!', 'test'), true);
        });

        it('Should return undefined if message is send twice in same round', function() {
            assert.strictEqual(utils.dontRepeat('Spam!', 'test'), true);
            assert.strictEqual(utils.dontRepeat('Spam!', 'test'), undefined);
            assert.strictEqual(utils.dontRepeat('Spam!', 'test'), undefined);
        });

        it('Should return false if message was send previous round', function() {
            assert.strictEqual(utils.dontRepeat('Spam!', 'test'), true);

            // Enter new game tick
            Game.time++;

            assert.strictEqual(utils.dontRepeat('Spam!', 'test'), false);
            assert.strictEqual(utils.dontRepeat('Spam!', 'test'), undefined);
            assert.strictEqual(utils.dontRepeat('Spam!', 'test'), undefined);
        });

        it('Should forget the message after 2 turns', function() {
            assert.strictEqual(utils.dontRepeat('Spam!', 'test'), true);

            // Move 2 game ticks further
            Game.time++;
            Game.time++;

            assert.strictEqual(utils.dontRepeat('Spam!', 'test'), true);
            assert.strictEqual(utils.dontRepeat('Spam!', 'test'), undefined);
            assert.strictEqual(utils.dontRepeat('Spam!', 'test'), undefined);
        });
    });

    describe('logOnce', function() {
        it('Should only only produce 1 message if repeated in same round', function() {
            var buffer = [];
            var f = function() {
                utils.logOnce("Test");
                utils.logOnce("Test");
            };

            assert.equal(generics.bufferConsole(f, buffer), undefined);
            assert.deepEqual(buffer, [["Test"]]);
        });

        it('Should give warnings if requested', function() {
            var buffer = [];
            var f = function() {
                utils.logOnce("Test", true);
                utils.logOnce("Test", true);
            };

            assert.equal(generics.bufferConsole(f, buffer), undefined);
            assert.deepEqual(
                buffer,
                [["Test"], ["Warning: reusing message \"Test\" in same round"]]
            );
        });

        it('Should ignore messages repeated in the next round', function() {
            var buffer = [];
            var f = function() {
                utils.logOnce("Test");

                // Enter new game tick
                Game.time++;
                utils.logOnce("Test");
            };

            assert.equal(generics.bufferConsole(f, buffer), undefined);
            assert.deepEqual(buffer, [["Test"]]);
        });

        it('Should not warn about ignored messages in next round', function() {
            var buffer = [];
            var f = function() {
                utils.logOnce("Test", true);

                // Enter new game tick
                Game.time++;
                utils.logOnce("Test", true);
            };

            assert.equal(generics.bufferConsole(f, buffer), undefined);
            assert.deepEqual(buffer, [["Test"]]);
        });
    });

    describe('isFirstTurn', function() {
        beforeEach(function() {
            utils.test.firstTurnCache = undefined;
        });

        it("Should return true if turn equals to zero", function() {
            assert.strictEqual(utils.isFirstTurn(), true);
            assert.strictEqual(Array.isArray(Memory.permanent.spawnIds), true);
            assert.strictEqual(utils.test.firstTurnCache, true);
        });

        it("Should return false if turn not equals zero or ai has state", function() {
            assert.strictEqual(utils.isFirstTurn(), true);
            assert.strictEqual(Array.isArray(Memory.permanent.spawnIds), true);
            assert.strictEqual(utils.test.firstTurnCache, true);

            // Enter a new game tick
            Game.time++;
            utils.test.firstTurnCache = undefined; // Reset turnly reset cache
            assert.strictEqual(utils.isFirstTurn(), false);
            assert.strictEqual(utils.test.firstTurnCache, false);
        });

        it("Should restart if different it can't find old spawns", function() {
            assert.strictEqual(utils.isFirstTurn(), true);
            assert.strictEqual(Array.isArray(Memory.permanent.spawnIds), true);
            assert.strictEqual(utils.test.firstTurnCache, true);

            // Enter a new game tick with a different spawn
            Game.time++;
            Game.spawns.Spawn1.id += "-changed";
            utils.test.firstTurnCache = undefined; // Reset turnly reset cache
            assert.strictEqual(utils.isFirstTurn(), true);
            assert.strictEqual(utils.test.firstTurnCache, true);

            // Enter a new game tick
            Game.time++;
            utils.test.firstTurnCache = undefined; // Reset turnly reset cache
            assert.strictEqual(utils.isFirstTurn(), false);
            assert.strictEqual(utils.test.firstTurnCache, false);
        });

        it("Should use the cache if its not set to undefined", function() {
            utils.test.firstTurnCache = false;
            assert.strictEqual(utils.isFirstTurn(), false);

            utils.test.firstTurnCache = true;
            assert.strictEqual(utils.isFirstTurn(), true);

            utils.test.firstTurnCache = false;
            assert.strictEqual(utils.isFirstTurn(), false);

            utils.test.firstTurnCache = true;
            assert.strictEqual(utils.isFirstTurn(), true);
        });

        it("Should log restarts after 10 ticks of being inactive (to prevent false positives)", function() {
            assert.strictEqual(utils.isFirstTurn(), true);
            assert.deepEqual(Memory.permanent.restarts, [{start: 1, spawns: ['id219970']}]);
            assert.deepEqual(Memory.permanent.spawnIds, ['id219970']);
            assert.strictEqual(Memory.permanent.firstTurn, 1);

            // Normal restart
            utils.test.firstTurnCache = undefined; // Reset cache
            Game.time += 10; // Game restarts some time later
            Game.spawns.Spawn1.id += "-new"; // With a new spawn

            assert.strictEqual(utils.isFirstTurn(), true);
            assert.deepEqual(Memory.permanent.restarts, [
                {start: 1, spawns: ['id219970']},
                {start: 11, spawns: ['id219970-new']}
            ]);
            assert.deepEqual(Memory.permanent.spawnIds, ['id219970-new']);
            assert.strictEqual(Memory.permanent.firstTurn, 11);
            assert.strictEqual(Memory.permanent.multipleRestartsSince, undefined);

            // Restart with false start (restarted in 10 ticks)
            utils.test.firstTurnCache = undefined; // Reset cache
            Game.time += 1; // Game restarts some time later
            Game.spawns.Spawn1.id += "-blah"; // With a new spawn

            assert.strictEqual(utils.isFirstTurn(), true);
            assert.deepEqual(Memory.permanent.restarts, [
                {start: 1, spawns: ['id219970']},
                {start: 11, spawns: ['id219970-new']},
            ]);
            assert.deepEqual(Memory.permanent.spawnIds, ['id219970-new-blah']);
            assert.strictEqual(Memory.permanent.firstTurn, 12);
            assert.strictEqual(Memory.permanent.multipleRestartsSince, 12);

            // Get out false start
            utils.test.firstTurnCache = undefined; // Reset cache
            Game.time += 10; // Game restarts some time later
            Game.spawns.Spawn1.id += "-blah"; // With a new spawn

            assert.strictEqual(utils.isFirstTurn(), true);
            assert.deepEqual(Memory.permanent.restarts, [
                {start: 1, spawns: ['id219970']},
                {start: 11, spawns: ['id219970-new']},
                {start: 22, spawns: ['id219970-new-blah-blah'], multipleRestartsSince: 12}
            ]);
            assert.deepEqual(Memory.permanent.spawnIds, ['id219970-new-blah-blah']);
            assert.strictEqual(Memory.permanent.firstTurn, 22);
            assert.strictEqual(Memory.permanent.multipleRestartsSince, undefined);
        });
    });
});