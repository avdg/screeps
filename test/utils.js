'use strict';

var assert = require('assert');

function reset() {
    require('../lib/mocks/gameStateStart');
}
reset();

var utils = require('../scripts/_utils');
beforeEach(reset); // resets once before every global describe

describe('exec', function() {
    it('Should fail when no arguments are passed', function() {
        var executeWithoutParameters = function() {
            utils.exec();
        };

        var errorValidator = function(e) {
            return e instanceof Error &&
                e.message === "Expected at least 1 parameter to execute a function"
        };

        assert.throws(executeWithoutParameters, errorValidator);
    });
});

describe('getCreepCost', function() {
    it('Should return a number higher than 0 when giving an array of body parts', function() {
        var result = utils.getCreepCost([TOUGH]);

        assert.equal("number", typeof result);
        assert.equal(true,     result > 0);
    });

    it('Should return -1 when invalid parts are passed', function() {
        var result = utils.getCreepCost(["foo"]);

        assert.equal("number", typeof result);
        assert.equal(true,     result === -1);
    });
});

describe('dontRepeat', function() {
    it('Should return false if message is unique', function() {
        assert.strictEqual(true, utils.dontRepeat('Spam!', 'test'));
    });

    it('Should return undefined if message is send twice in same round', function() {
        // ... continues from previous test .... we already spammed once
        assert.strictEqual(undefined, utils.dontRepeat('Spam!', 'test'));
        assert.strictEqual(undefined, utils.dontRepeat('Spam!', 'test'));
    });

    it('Should return true if message was send previous round', function() {
        // ... continues from previous test .... we already spammed, but we enter a new tick
        Game.time++;

        assert.strictEqual(false,     utils.dontRepeat('Spam!', 'test'));
        assert.strictEqual(undefined, utils.dontRepeat('Spam!', 'test'));
        assert.strictEqual(undefined, utils.dontRepeat('Spam!', 'test'));
    });

    it('Should forget the message after 2 turns', function() {
        // ... Continues from previous test ... we already spammed, but we are 2 ticks further
        Game.time++;
        Game.time++;

        assert.strictEqual(true,      utils.dontRepeat('Spam!', 'test'));
        assert.strictEqual(undefined, utils.dontRepeat('Spam!', 'test'));
        assert.strictEqual(undefined, utils.dontRepeat('Spam!', 'test'));
    });
});

describe('logOnce', function() {
    // No testing unless we can mock console
});

describe('isFirstTurn', function() {
    it("Should return true if turn equals to zero", function() {
        assert.strictEqual(true, utils.isFirstTurn());
    });

    it("Should return false if turn not equals zero or ai has state", function() {
        Memory.spawnQueue = []; // Memory reset
        Game.time++;
        assert.strictEqual(false, utils.isFirstTurn());
    });
});
