'use strict';

var assert = require('assert');
var simple = require('simple-mock');

var generic = require("../../../../scripts/_generics.js");
var hookFlags = require('../../../../extensions/tools/hooks/flags');

var commandRemoveFlag = require("../../../../extensions/tools/commands/removeFlag");

function reset() {
    global.AI = {
        extensions: {
            commands: {
                removeFlag: commandRemoveFlag
            }
        },
        parseCommand: generic.parseCommand
    };
}

describe('Tool extensions: Command removeFlag', function() {
    beforeEach(reset);

    it('Should remove its own flag when being called', function() {
        var flag = {
            name: 'removeFlag',
            remove: function() {}
        };

        var fn = simple.mock(flag, 'remove');
        var buffer = [];

        generic.bufferConsole(
            function() { hookFlags.test.parseFlag(flag); },
            buffer
        );

        assert.equal(fn.callCount, 1);
        assert.deepEqual([['Flag command removeFlag: removed removeFlag']], buffer);
    });
});