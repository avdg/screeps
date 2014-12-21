var assert = require('assert');

function reset() {
    require('../lib/mocks/gameStateStart');
}
reset();

var generics = require('../scripts/_generics');
beforeEach(reset); // resets once before every global describe

describe('generator', function() {
    it('Should return a string', function() {
        assert.equal("string", typeof generics.generator());
    });
});

describe('getCreepCost', function() {
    it('Should return an number when giving an array of body parts', function() {
        assert.equal("number", typeof generics.getCreepCost([Game.TOUGH]));
    });
});

describe('parseCommand', function() {
    it('Should parse these given commands without problems', function() {
        assert.deepEqual(
            ['test', 'muted', 'sound'],
            generics.parseCommand('test muted sound')
        );
        assert.deepEqual(
            ['test', '\\mute"ed', 'sound'],
            generics.parseCommand('test "\\\\mute\\"ed" sound')
        );
        assert.deepEqual(
            ['test', 'mute', 'sound'],
            generics.parseCommand('test "mute"sound')
        );
    });
});

describe('dontRepeat', function() {
    it('Should return false if message is unique', function() {
        assert.strictEqual(true, generics.dontRepeat('Spam!', 'test'));
    });

    it('Should return undefined if message is send twice in same round', function() {
        // ... continues from previous test .... we already spammed once
        assert.strictEqual(undefined, generics.dontRepeat('Spam!', 'test'));
        assert.strictEqual(undefined, generics.dontRepeat('Spam!', 'test'));
    });

    it('Should return true if message was send previous round', function() {
        // ... continues from previous test .... we already spammed, but we enter a new tick
        Game.time++;

        assert.strictEqual(false,     generics.dontRepeat('Spam!', 'test'));
        assert.strictEqual(undefined, generics.dontRepeat('Spam!', 'test'));
        assert.strictEqual(undefined, generics.dontRepeat('Spam!', 'test'));
    });

    it('Should forget the message after 2 turns', function() {
        // ... Continues from previous test ... we already spammed, but we are 2 ticks further
        Game.time++;
        Game.time++;

        assert.strictEqual(true,      generics.dontRepeat('Spam!', 'test'));
        assert.strictEqual(undefined, generics.dontRepeat('Spam!', 'test'));
        assert.strictEqual(undefined, generics.dontRepeat('Spam!', 'test'));
    });
});

describe('logOnce', function() {
    // No testing unless we can mock console
});

describe('isFirstTurn', function() {
    it("Should return true if turn equals to zero", function() {
        assert.strictEqual(true, generics.isFirstTurn());
    });

    it("Should return false if turn not equals zero or ai has state", function() {
        Memory.spawnQueue = []; // Memory reset
        Game.time++;
        assert.strictEqual(false, generics.isFirstTurn());
    });
});
