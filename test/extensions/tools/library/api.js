'use strict';

var assert = require('assert');

var simple = require('simple-mock');

function reset() {
    require('../../../../lib/mocks/gameStateGlobals')();

    global.AI = {
        extensions: {
            targets: {}
        }
    };
}
reset();

var lib = require('../../../../extensions/tools/library/api');

describe('Library extension: api', function() {
    beforeEach(reset);

    describe('Room.prototype.get', function() {
        it('Should be able to call the target getter', function() {
            AI.extensions.targets.testTarget = {
                get: function() {}
            };

            lib.reset();
            var fn = simple.mock(AI.extensions.targets.testTarget, 'get');

            var room = new Room("test");
            room.get("testTarget");

            assert.equal(fn.callCount, 1);
        });
    });

    describe('RoomPosition.prototype.countEmptyTilesAround', function() {
        beforeEach(function() {
            lib.reset();
            AI.hasWall = require('../../../../extensions/tools/library/room').hasWall;
        });

        it('Should count tiles around a given position (1)', function() {
            Game.rooms.test = {};

            var fn1 = simple.mock(Game.rooms.test, 'lookAtArea').returnWith({
                7: {
                    2: [],
                    3: [],
                    4: []
                },
                8: {
                    2: [],
                    3: [],
                    4: []
                },
                9: {
                    2: [],
                    3: [],
                    4: []
                }
            });

            var pos = new RoomPosition(3, 8, 'test');

            assert.equal(8, pos.countEmptyTilesAround());
        });

        it('Should count tiles around a given position (2)', function() {
            Game.rooms.test = {};

            var fn = simple.mock(Game.rooms.test, 'lookAtArea').returnWith({
                7: {
                    2: [],
                    3: [{type: 'terrain', terrain: 'wall'}],
                    4: []
                },
                8: {
                    2: [],
                    3: [],
                    4: []
                },
                9: {
                    2: [],
                    3: [],
                    4: []
                }
            });

            var pos = new RoomPosition(3, 8, 'test');

            assert.equal(pos.countEmptyTilesAround(), 7);
            assert.equal(fn.callCount, 1);
        });

        it('Should return undefined when a an edge position is given', function() {
            assert.strictEqual((new RoomPosition(-1, 3, 'test')).countEmptyTilesAround(), undefined);
            assert.strictEqual((new RoomPosition(50, 3, 'test')).countEmptyTilesAround(), undefined);
            assert.strictEqual((new RoomPosition(0, -1, 'test')).countEmptyTilesAround(), undefined);
            assert.strictEqual((new RoomPosition(0, 50, 'test')).countEmptyTilesAround(), undefined);
        });

        it('Should return 3 if there are no walls and position is a corner', function() {
            Game.rooms.test = {};

            var fn = simple.mock(Game.rooms.test, 'lookAtArea').returnWith({
                0: {
                    0: [],
                    1: []
                },
                1: {
                    0: [],
                    1: []
                }
            });

            var pos = new RoomPosition(0, 0, 'test');

            assert.equal(pos.countEmptyTilesAround(), 3);
            assert.equal(fn.callCount, 1);
        });

        it('Should return 3 if there are no walls and position is a corner (2)', function() {
            Game.rooms.test = {};

            var fn = simple.mock(Game.rooms.test, 'lookAtArea').returnWith({
                48: {
                    48: [],
                    49: []
                },
                49: {
                    48: [],
                    49: []
                }
            });

            var pos = new RoomPosition(49, 49, 'test');

            assert.equal(pos.countEmptyTilesAround(), 3);
            assert.equal(fn.callCount, 1);
        });
    });

    describe('AI.get', function() {
        it('Should be able to call the target getter', function() {
            AI.extensions.targets.anotherTarget = {
                get: function() {}
            };

            lib.reset();
            var fn = simple.mock(AI.extensions.targets.anotherTarget, 'get');

            AI.get("anotherTarget");

            assert.equal(fn.callCount, 1);
        });
    });
});