'use strict';

var assert = require('assert');
var simple = require('simple-mock');

var generic = require('../../../../scripts/_generics');
var util = require('../../../../scripts/_utils');
var hookFlags = require('../../../../extensions/tools/hooks/flags');

var commandShowPath = require('../../../../extensions/tools/commands/showPath');

function reset() {
    require('../../../../lib/mocks/gameStateStart')();
    commandShowPath.test.reset();
    global.AI = {
        extensions: {
            commands: {
                showPath: commandShowPath
            }
        },
        parseCommand: generic.parseCommand,
        exec: util.exec
    };
}

describe('Tool extensions: Command showPath', function() {
    beforeEach(reset);

    it('Should set the flags and its memory correctly when showPath is called', function() {
        var pos1 = new RoomPosition(1, 1, "test");
        var pos2 = new RoomPosition(5, 5, "test");

        Game.rooms.test = {};
        Memory.flags = {};

        var fn1 = simple.mock(pos1, 'findPathTo').returnWith([
            {x: 2, y: 2},
            {x: 3, y: 3},
            {x: 4, y: 4},
            {x: 5, y: 5},
        ]);

        var fn2 = simple.mock(Game.rooms.test, 'createFlag').returnWith(OK);

        commandShowPath.test.showPath(pos1, pos2);

        assert.equal(fn1.callCount, 1);
        assert.equal(fn2.callCount, 3);
        assert.deepEqual(Memory.flags, {
            " ": {
                handler: "showPath",
                path: [{
                    x: 4,
                    y: 4
                }],
                ticks: 3,
                ticksToLive: 1
            },
            "  ": {
                handler: "showPath",
                path: [{
                    x: 5,
                    y: 5
                }],
                ticks: 3,
                ticksToLive: 2
            },
            "   ": {
                handler: "showPath",
                path: [],
                ticks: 3,
                ticksToLive: 3
            }
        });
        assert.deepEqual(fn2.calls[0].args, [
            {x: 1, y: 1, roomName: "test"},
            " ",
            "brown"
        ]);
        assert.deepEqual(fn2.calls[1].args, [
            {x: 2, y: 2, roomName: "test"},
            "  ",
            "brown"
        ]);
        assert.deepEqual(fn2.calls[2].args, [
            {x: 3, y: 3, roomName: "test"},
            "   ",
            "brown"
        ]);
    });

    it('Should ignore a showPath order when path length is zero', function() {
        var pos1 = new RoomPosition(1, 1, "test");
        var pos2 = new RoomPosition(5, 5, "test");

        // Remember: we are god this time, we can do anything right now...
        //           like manipulating with the path results...
        var fn = simple.mock(pos1, 'findPathTo').returnWith([]);

        commandShowPath.test.showPath(pos1, pos2);

        assert.equal(fn.callCount, 1);
    });

    it('Countdown should reduce ticksToLive by one in normal procedure', function() {
        Memory.flags = {
            " ": {
                ticksToLive: 3,
            }
        };

        var flag = {
            name: " ",
            get memory() {
                return Memory.flags[this.name];
            }
        };

        var fn = simple.mock(flag, 'remove');

        commandShowPath.test.countDown(flag);

        assert.equal(Memory.flags[" "].ticksToLive, 2);
        assert.equal(fn.callCount, 0);
    });

    it('Countdown should remove flag if no path is found (and countDown is zero) because the path array is empty', function() {
        Memory.flags = {
            " ": {
                ticksToLive: 0,
                path: []
            }
        };

        var flag = {
            name: " ",
            get memory() {
                return Memory.flags[this.name];
            }
        };

        var fn = simple.mock(flag, 'remove');

        commandShowPath.test.countDown(flag);

        assert.strictEqual(Memory.flags[" "], undefined);
        assert.equal(fn.callCount, 1);
    });

    it('Countdown should remove flag if no path is found (and countDown is zero) because there is no path', function() {
        Memory.flags = {
            " ": {
                ticksToLive: 0,
            }
        };

        var flag = {
            name: " ",
            get memory() {
                return Memory.flags[this.name];
            }
        };

        var fn = simple.mock(flag, 'remove');

        commandShowPath.test.countDown(flag);

        assert.strictEqual(Memory.flags[" "], undefined);
        assert.equal(fn.callCount, 1);
    });

    it("Countdown should move flag to next position if countDown is zero", function() {
        Memory.flags = {
            " ": {
                ticksToLive: 0,
                ticks: 15,
                path: [{x: 5, y: 5}]
            }
        };

        var flag = {
            name: " ",
            pos: {
                roomName: "test",
            },
            get memory() {
                return Memory.flags[this.name];
            }
        };

        var fn = simple.mock(flag, 'setPosition');

        commandShowPath.test.countDown(flag);

        assert.strictEqual(Memory.flags[" "].ticksToLive, 15);
        assert.equal(fn.callCount, 1);
        assert.deepEqual(fn.lastCall.args, [
            new RoomPosition(5, 5, "test")
        ]);
    });

    it("Native should execute showPath", function() {
        var pos1 = new RoomPosition(1, 1, "test");
        var pos2 = new RoomPosition(5, 5, "test");

        // Remember: we are god this time, we can do anything right now...
        //           like manipulating with the path results...
        var fn = simple.mock(pos1, 'findPathTo').returnWith([]);

        commandShowPath.native('showPath', pos1, pos2);

        assert.equal(fn.callCount, 1);
    });

    it("Should trigger countDown if flag value only contains spaces and flag memory contains handler", function() {
        Memory.flags = {
            "       ": {
                ticksToLive: 2,
                handler: "showPath",
                name: "       "
            }
        };

        var flag = {
            name: "       ",
            get memory() {
                return Memory.flags[this.name];
            }
        };
        var buffer = [];

        var fn = simple.mock(flag, 'remove');

        generic.bufferConsole(
            function() { commandShowPath.exec(flag, generic.parseCommand(flag.name)); },
            buffer
        );

        assert.deepEqual(buffer, []);
        assert.equal(fn.callCount, 0);
        assert.equal(Memory.flags["       "].ticksToLive, 1);
    });

    it("Should be able to accept 4 parameters, execute showPath and remove the flag", function() {
        Memory.flags = {
        };

        var flag = {
            name: "showPath 1 1 5 5",
            pos: {
                roomName: "test"
            }
        };
        var buffer = [];

        Game.rooms.test = {};
        RoomPosition.prototype.roomName = 'test';

        var fn1 = simple.mock(flag, 'remove');
        var fn2 = simple.mock(RoomPosition.prototype, 'findPathTo').returnWith([
            {x: 2, y: 2},
            {x: 3, y: 3},
            {x: 4, y: 4},
            {x: 5, y: 5},
        ]);
        var fn3 = simple.mock(Game.rooms.test, 'createFlag').returnWith(OK);

        generic.bufferConsole(
            function() { commandShowPath.exec(flag, generic.parseCommand(flag.name)); },
            buffer
        );

        assert.deepEqual(Memory.flags, {
            " ": {
                handler: "showPath",
                path: [
                    {x: 4, y: 4}
                ],
                ticks: 3,
                ticksToLive: 1
            },
            "  ": {
                handler: "showPath",
                path: [
                    {x: 5, y: 5}
                ],
                ticks: 3,
                ticksToLive: 2
            },
            "   ": {
                handler: "showPath",
                path: [],
                ticks: 3,
                ticksToLive: 3
            }
        });

        assert.deepEqual(fn1.callCount, 1);
        assert.deepEqual(fn2.callCount, 1);
        assert.deepEqual(fn3.callCount, 3);

        assert.deepEqual(fn3.calls[0].args, [
            {x: 1, y: 1, roomName: "test"},
            " ",
            "brown"
        ]);
        assert.deepEqual(fn3.calls[1].args, [
            {x: 2, y: 2, roomName: "test"},
            "  ",
            "brown"
        ]);
        assert.deepEqual(fn3.calls[2].args, [
            {x: 3, y: 3, roomName: "test"},
            "   ",
            "brown"
        ]);
    });
    it("Should be able to accept 2 parameters, execute showPath and remove the flag", function() {
        Memory.flags = {
        };

        var flag = {
            name: "showPath 1 1",
            pos: {
                x: 5,
                y: 5,
                roomName: "test"
            }
        };
        var buffer = [];

        Game.rooms.test = {};
        RoomPosition.prototype.roomName = 'test';

        var fn1 = simple.mock(flag, 'remove');
        var fn2 = simple.mock(flag.pos, 'findPathTo').returnWith([
            {x: 4, y: 4},
            {x: 3, y: 3},
            {x: 2, y: 2},
            {x: 1, y: 1}
        ]);
        var fn3 = simple.mock(Game.rooms.test, 'createFlag').returnWith(OK);

        generic.bufferConsole(
            function() { commandShowPath.exec(flag, generic.parseCommand(flag.name)); },
            buffer
        );

        assert.deepEqual(Memory.flags, {
            " ": {
                handler: "showPath",
                path: [
                    {x: 2, y: 2}
                ],
                ticks: 3,
                ticksToLive: 1
            },
            "  ": {
                handler: "showPath",
                path: [
                    {x: 1, y: 1}
                ],
                ticks: 3,
                ticksToLive: 2
            },
            "   ": {
                handler: "showPath",
                path: [],
                ticks: 3,
                ticksToLive: 3
            }
        });

        assert.deepEqual(fn1.callCount, 1);
        assert.deepEqual(fn2.callCount, 1);
        assert.deepEqual(fn3.callCount, 3);

        assert.deepEqual(fn3.calls[0].args, [
            {x: 5, y: 5, roomName: "test"},
            " ",
            "brown"
        ]);
        assert.deepEqual(fn3.calls[1].args, [
            {x: 4, y: 4, roomName: "test"},
            "  ",
            "brown"
        ]);
        assert.deepEqual(fn3.calls[2].args, [
            {x: 3, y: 3, roomName: "test"},
            "   ",
            "brown"
        ]);
    });
    it("Should remove the flag without executing showPath if no valid arguments are given", function() {
        var flag = {
            name: "showPath"
        };
        var buffer = [];

        var fn = simple.mock(flag, 'remove');

        generic.bufferConsole(
            function() { hookFlags.test.parseFlag(flag); },
            buffer
        );

        assert.deepEqual(buffer, [["Command showPath: Invalid arguments provided"]]);
        assert.equal(fn.callCount, 1);
    });
});