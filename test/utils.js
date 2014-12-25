var assert = require('assert');

function reset() {
    require('../lib/mocks/gameStateStart');
}
reset();

var utils = require('../scripts/_utils');
beforeEach(reset); // resets once before every global describe

describe('getCreepCost', function() {
    it('Should return an number when giving an array of body parts', function() {
        assert.equal("number", typeof utils.getCreepCost([Game.TOUGH]));
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
