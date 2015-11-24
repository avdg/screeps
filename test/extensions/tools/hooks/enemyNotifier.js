"use strict";

var assert = require("assert");
var simple = require("simple-mock");

var hookEnemyNotifier = require("../../../../extensions/tools/hooks/enemyNotifier");
var lib = require("../../../../extensions/tools/library/utils");

function reset() {
    require("../../../../lib/mocks/gameStateGlobals")();

    Memory.permanent = {};
}

describe("Hook extensions: enemyNotifier", function() {
    beforeEach(reset);

    it("Should warn if a hostile enemy has been detected", function() {
        Game.rooms = {
            test: {
                find: function() {},
                mode: MODE_WORLD
            }
        };

        Game.time = 1234;

        var enemies = [
            {
                owner: {
                    username: "evil"
                },
                pos: {
                    x: 6,
                    y: 15
                }
            }
        ];

        var buffer = [];
        var fnNotify = simple.mock(Game, "notify");
        var fn1 = simple.mock(Game.rooms.test, "find").returnWith(enemies);

        assert.strictEqual(lib.bufferConsole(
            function() { hookEnemyNotifier.preController(); },
            buffer
        ), undefined);

        assert.deepEqual(Memory.permanent.enemies, {
            evil: 1234
        });

        assert.deepEqual(buffer, [
            ["Round 1234: Found enemy evil in room test, first spotted at 6,15"]
        ]);

        assert.equal(fnNotify.callCount, 1);
        assert.equal(fn1.callCount, 1);
    });

    it("Should not warn if the enemy is a source keeper", function() {
        Game.rooms = {
            test: {
                find: function() {},
                mode: MODE_WORLD
            }
        };

        Game.time = 2345;

        var enemies = [
            {
                owner: {
                    username: "Source Keeper"
                }
            }
        ];

        var buffer = [];
        var fnNotify = simple.mock(Game, "notify");
        var fn1 = simple.mock(Game.rooms.test, "find").returnWith(enemies);

        assert.strictEqual(lib.bufferConsole(
            function() { hookEnemyNotifier.preController(); },
            buffer
        ), undefined);

        assert.deepEqual(Memory.permanent.enemies, {});
        assert.deepEqual(buffer, []);
        assert.equal(fnNotify.callCount, 0);
        assert.equal(fn1.callCount, 1);
    });

    it("Should not warn in survivor mode", function() {
        Game.rooms = {
            test: {
                find: function() {},
                mode: MODE_SURVIVAL
            }
        };

        Game.time = 1234;

        var enemies = [
            {
                owner: {
                    username: "evil"
                }
            }
        ];

        var buffer = [];
        var fnNotify = simple.mock(Game, "notify");
        var fn1 = simple.mock(Game.rooms.test, "find").returnWith(enemies);

        assert.strictEqual(lib.bufferConsole(
            function() { hookEnemyNotifier.preController(); },
            buffer
        ), undefined);

        assert.deepEqual(Memory.permanent.enemies, {});
        assert.deepEqual(buffer, []);
        assert.equal(fnNotify.callCount, 0);
        assert.equal(fn1.callCount, 0);
    });

    it("Should not warn when timeout hasn't expired yet", function() {
        Game.rooms = {
            test: {
                find: function() {},
                mode: MODE_WORLD
            }
        };
        Memory.permanent.enemies = {
            evil: 1
        };

        Game.time = 3600;

        var enemies = [
            {
                owner: {
                    username: "evil"
                }
            }
        ];

        var buffer = [];
        var fnNotify = simple.mock(Game, "notify");
        var fn1 = simple.mock(Game.rooms.test, "find").returnWith(enemies);

        assert.strictEqual(lib.bufferConsole(
            function() { hookEnemyNotifier.preController(); },
            buffer
        ), undefined);

        assert.deepEqual(Memory.permanent.enemies, {
            evil: 1
        });

        assert.deepEqual(buffer, []);
        assert.equal(fnNotify.callCount, 0);
        assert.equal(fn1.callCount, 1);
    });

    it("Should be able to handle multiple creep warnings", function() {
        Game.rooms = {
            test: {
                find: function() {},
                mode: MODE_WORLD
            }
        };

        Memory.permanent = {};
        Game.time = 1;

        var enemies = [
            {
                owner: {
                    username: "muhahaa"
                },
                pos: {
                    x: 3,
                    y: 45,
                }
            },
            {
                owner: {
                    username: "dr. evil"
                },
                pos: {
                    x: 3,
                    y: 21
                }
            }
        ];

        var buffer = [];
        var fnNotify = simple.mock(Game, "notify");
        var fn1 = simple.mock(Game.rooms.test, "find").returnWith(enemies);

        assert.strictEqual(lib.bufferConsole(
            function() { hookEnemyNotifier.preController(); },
            buffer
        ), undefined);

        assert.deepEqual(Memory.permanent.enemies, {
            muhahaa: 1,
            "dr. evil": 1
        });

        assert.deepEqual(buffer, [
            ["Round 1: Found enemy muhahaa in room test, first spotted at 3,45"],
            ["Round 1: Found enemy dr. evil in room test, first spotted at 3,21"]
        ]);
        assert.equal(fnNotify.callCount, 2);
        assert.equal(fn1.callCount, 1);
    });
});