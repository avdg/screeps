'use strict';

var assert = require('assert');
var lib = require('../../../../extensions/tools/library/game');

function reset() {
    require('../../../../lib/mocks/gameStateStart')();
}

describe("Library extensions: game", function() {
    beforeEach(reset);

    describe('isFirstTurn', function() {
        beforeEach(function() {
            lib.test.firstTurnCache = undefined;
        });

        it("Should return true if turn equals to zero", function() {
            assert.strictEqual(lib.isFirstTurn(), true);
            assert.strictEqual(Array.isArray(Memory.permanent.spawnIds), true);
            assert.strictEqual(lib.test.firstTurnCache, true);
        });

        it("Should return false if turn not equals zero or ai has state", function() {
            assert.strictEqual(lib.isFirstTurn(), true);
            assert.strictEqual(Array.isArray(Memory.permanent.spawnIds), true);
            assert.strictEqual(lib.test.firstTurnCache, true);

            // Enter a new game tick
            Game.time++;
            lib.test.firstTurnCache = undefined; // Reset turnly reset cache
            assert.strictEqual(lib.isFirstTurn(), false);
            assert.strictEqual(lib.test.firstTurnCache, false);
        });

        it("Should restart if different it can't find old spawns", function() {
            assert.strictEqual(lib.isFirstTurn(), true);
            assert.strictEqual(Array.isArray(Memory.permanent.spawnIds), true);
            assert.strictEqual(lib.test.firstTurnCache, true);

            // Enter a new game tick with a different spawn
            Game.time++;
            Game.spawns.Spawn1.id += "-changed";
            lib.test.firstTurnCache = undefined; // Reset turnly reset cache
            assert.strictEqual(lib.isFirstTurn(), true);
            assert.strictEqual(lib.test.firstTurnCache, true);

            // Enter a new game tick
            Game.time++;
            lib.test.firstTurnCache = undefined; // Reset turnly reset cache
            assert.strictEqual(lib.isFirstTurn(), false);
            assert.strictEqual(lib.test.firstTurnCache, false);
        });

        it("Should use the cache if its not set to undefined", function() {
            lib.test.firstTurnCache = false;
            assert.strictEqual(lib.isFirstTurn(), false);

            lib.test.firstTurnCache = true;
            assert.strictEqual(lib.isFirstTurn(), true);

            lib.test.firstTurnCache = false;
            assert.strictEqual(lib.isFirstTurn(), false);

            lib.test.firstTurnCache = true;
            assert.strictEqual(lib.isFirstTurn(), true);
        });

        it("Should log restarts after 10 ticks of being inactive (to prevent false positives)", function() {
            assert.strictEqual(lib.isFirstTurn(), true);
            assert.deepEqual(Memory.permanent.restarts, [{start: 1, spawns: ['id219970']}]);
            assert.deepEqual(Memory.permanent.spawnIds, ['id219970']);
            assert.strictEqual(Memory.permanent.firstTurn, 1);

            // Normal restart
            lib.test.firstTurnCache = undefined; // Reset cache
            Game.time += 10; // Game restarts some time later
            Game.spawns.Spawn1.id += "-new"; // With a new spawn

            assert.strictEqual(lib.isFirstTurn(), true);
            assert.deepEqual(Memory.permanent.restarts, [
                {start: 1, spawns: ['id219970']},
                {start: 11, spawns: ['id219970-new']}
            ]);
            assert.deepEqual(Memory.permanent.spawnIds, ['id219970-new']);
            assert.strictEqual(Memory.permanent.firstTurn, 11);
            assert.strictEqual(Memory.permanent.multipleRestartsSince, undefined);

            // Restart with false start (restarted in 10 ticks)
            lib.test.firstTurnCache = undefined; // Reset cache
            Game.time += 1; // Game restarts some time later
            Game.spawns.Spawn1.id += "-blah"; // With a new spawn

            assert.strictEqual(lib.isFirstTurn(), true);
            assert.deepEqual(Memory.permanent.restarts, [
                {start: 1, spawns: ['id219970']},
                {start: 11, spawns: ['id219970-new']},
            ]);
            assert.deepEqual(Memory.permanent.spawnIds, ['id219970-new-blah']);
            assert.strictEqual(Memory.permanent.firstTurn, 12);
            assert.strictEqual(Memory.permanent.multipleRestartsSince, 12);

            // Get out false start
            lib.test.firstTurnCache = undefined; // Reset cache
            Game.time += 10; // Game restarts some time later
            Game.spawns.Spawn1.id += "-blah"; // With a new spawn

            assert.strictEqual(lib.isFirstTurn(), true);
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