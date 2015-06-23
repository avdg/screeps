'use strict';

var assert = require('assert');

var simple = require('simple-mock');

function reset() {
    var roomMock = global.Room = function(roomName) {
        this.roomName = roomName;
    };
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