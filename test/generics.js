var assert = require('assert');

var generics = require('../scripts/_generics');

describe('generator', function() {
    it('Should return a string', function() {
        assert.equal("string", typeof generics.generator());
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
