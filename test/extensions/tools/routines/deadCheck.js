'use strict';

var assert = require('assert');
var simple = require('simple-mock');

var routineDeadCheck = require('../../../../extensions/tools/routines/deadCheck');

function reset() {
    require('../../../../lib/mocks/gameStateStart')();
}

describe('Routine extensions: deadCheck', function() {
    beforeEach(reset);

    it('Should drop when a creep has 1 tick to live', function() {
        var creep = {
            ticksToLive: 1,
            drop: function() {},
            say: function() {}
        };

        var fn1 = simple.mock(creep, 'drop');
        var fn2 = simple.mock(creep, 'say');

        assert.equal(routineDeadCheck.routine(creep), true);
        assert.equal(fn1.callCount, 2);
        assert.equal(fn1.calls[0].args[0], RESOURCE_ENERGY);
        assert.equal(fn1.calls[1].args[0], RESOURCE_POWER);
        assert.equal(fn2.callCount, 0);
    });

    it('Should say "Bye bye!" when a creep has 2 ticks to live', function() {
        var creep = {
            ticksToLive: 2,
            dropEnergy: function() {},
            say: function() {}
        };

        var fn1 = simple.mock(creep, 'dropEnergy');
        var fn2 = simple.mock(creep, 'say');

        assert.equal(routineDeadCheck.routine(creep), false);
        assert.equal(fn1.callCount, 0);
        assert.equal(fn2.callCount, 1);

        assert.deepEqual(fn2.calls[0].args, ["Bye bye!"]);
    });

    it('Should do nothing when a creep has 3 ticks or more', function() {
        var creep = {
            ticksToLive: 3,
            dropEnergy: function() {},
            say: function() {}
        };

        var fn1 = simple.mock(creep, 'dropEnergy');
        var fn2 = simple.mock(creep, 'say');

        assert.equal(routineDeadCheck.routine(creep), false);
        assert.equal(fn1.callCount, 0);
        assert.equal(fn2.callCount, 0);
    });
});