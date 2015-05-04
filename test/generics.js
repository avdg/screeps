'use strict';

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
