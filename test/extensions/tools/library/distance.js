'use strict';

var assert = require('assert');
var lib = require('../../../../extensions/tools/library/distance');

function reset() {
    require('../../../../lib/mocks/gameStateStart')();
}

describe('Library extensions: distance', function() {
    beforeEach(reset);

    describe('distance', function() {
        it('Should return the bird distance', function() {
            assert.equal(lib.distance(1, 2, 4, 6), 5);
        });

        it('Should accept objects containing x and y properties', function() {
            var pos1 = {x: 1, y: 2};
            var pos2 = {x: 4, y: 6};

            assert.equal(lib.distance(pos1, pos2), 5);
        });

        it('Should accept objects containing position objects', function() {
            var pos1 = {pos: new RoomPosition(1, 2, "test") };
            var pos2 = {pos: new RoomPosition(4, 6, "test") };

            assert.equal(lib.distance(pos1, pos2), 5);
        });

        it('Should only accept position objects from the same room', function() {
            var pos1 = {pos: new RoomPosition(1, 2, "test") };
            var pos2 = {pos: new RoomPosition(4, 6, "room") };

            assert.equal(lib.distance(pos1, pos2), ERR_NOT_IN_RANGE);
        });
    });

    describe('manhatten', function() {
        it('Should return square distances', function() {
            assert.equal(lib.manhattenDistance(1, 2, 3, 4), 4);
        });

        it('Should accept objects containing x and y properties', function() {
            var pos1 = {x: 2, y: 3};
            var pos2 = {x: 4, y: 5};

            assert.equal(lib.manhattenDistance(pos1, pos2), 4);
        });

        it('Should accept objects containing position objects', function() {
            var pos1 = {pos: new RoomPosition(3, 4, "test") };
            var pos2 = {pos: new RoomPosition(5, 6, "test") };

            assert.equal(lib.manhattenDistance(pos1, pos2), 4);
        });

        it('Should only accept position objects from the same room', function() {
            var pos1 = {pos: new RoomPosition(1, 2, "test") };
            var pos2 = {pos: new RoomPosition(4, 6, "room") };

            assert.equal(lib.manhattenDistance(pos1, pos2), ERR_NOT_IN_RANGE);
        });
    });
});