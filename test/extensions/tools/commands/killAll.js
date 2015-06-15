'use strict';

var assert = require('assert');
var simple = require('simple-mock');

var lib = require('../../../../extensions/tools/library/commands');
var hookFlags = require("../../../../extensions/tools/hooks/flags");

var commandKillAll = require("../../../../extensions/tools/commands/killAll");

function reset() {
    require('../../../../lib/mocks/gameStateStart')();

    global.AI = {
        extensions: {
            commands: {
                killAll: commandKillAll
            }
        },
        parseCommand: lib.parseCommand
    };
}

describe('Tool extensions: Command killAll', function() {
    beforeEach(reset);

    it('Should call suicide on all owning creeps', function() {
        Game.creeps = {
            test1: {
                suicide: function() {}
            },
            test2: {
                suicide: function() {}
            }
        };

        var flag = {
            name: 'killAll',
            remove: function() {}
        };

        var fn  = simple.mock(flag, 'remove');
        var fn1 = simple.mock(Game.creeps.test1, 'suicide');
        var fn2 = simple.mock(Game.creeps.test2, 'suicide');

        assert.equal(fn.callCount,  0);
        assert.equal(fn1.callCount, 0);
        assert.equal(fn2.callCount, 0);

        hookFlags.test.parseFlag(flag);

        assert.equal(fn.callCount,  1);
        assert.equal(fn1.callCount, 1);
        assert.equal(fn2.callCount, 1);
    });

    it('Should not error when there are no creeps to remove', function() {

    var flag = {
        name: 'killAll',
        remove: function() {}
    };

    var fn  = simple.mock(flag, 'remove');

    assert.equal(fn.callCount,  0);

    hookFlags.test.parseFlag(flag);

    assert.equal(fn.callCount,  1);
    });
});