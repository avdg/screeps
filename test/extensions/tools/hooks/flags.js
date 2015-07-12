'use strict';

var assert = require('assert');
var simple = require('simple-mock');

var lib = require('../../../../extensions/tools/library/commands');
var hookFlags = require('../../../../extensions/tools/hooks/flags');

function reset() {
    require('../../../../lib/mocks/gameStateStart')();
}

describe('Hook extensions: Flags', function() {
    beforeEach(reset);

    it('preController should iterate through all flags', function() {
        global.AI = {
            extensions: {
                commands: {
                    test: {
                        exec: function() {}
                    }
                }
            },
            parseCommand: lib.parseCommand
        };

        // Flag mocks
        Game.flags = {
            "test blah": {name: "test blah"},
            "test blup": {name: "test blup"}
        };

        var fn = simple.mock(AI.extensions.commands.test, 'exec');
        hookFlags.preController();

        assert.equal(fn.callCount, 2);
    });

    it('should use Memory[flag].handler if provided', function() {
        global.AI = {
            extensions: {
                commands: {
                    test: {
                        exec: function() {}
                    },
                    callMe: {
                        exec: function() {}
                    }
                }
            },
            parseCommand: lib.parseCommand
        };

        Game.flags = {
            "test blup": {name: "test blup", memory: { handler: "callMe" } }
        };

        var fn1 = simple.mock(AI.extensions.commands.test, 'exec');
        var fn2 = simple.mock(AI.extensions.commands.callMe, 'exec');

        hookFlags.preController();

        assert.equal(fn1.callCount, 0);
        assert.equal(fn2.callCount, 1);
    });
});