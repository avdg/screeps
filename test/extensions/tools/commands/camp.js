'use strict';

var assert = require('assert');
var simple = require('simple-mock');

var generic = require("../../../../scripts/_generics");
var hookFlags = require("../../../../extensions/tools/hooks/flags");

var commandCamp = require("../../../../extensions/tools/commands/camp");

function reset() {
    global.AI = {
        extensions: {
            commands: {
                camp: commandCamp
            }
        },
        parseCommand: generic.parseCommand
    };
}

describe('Tool extensions: Command camp', function() {
    beforeEach(reset);

    it('Should do nothing', function() {
        var flag = {
            name: 'removeFlag',
            remove: function() {}
        };

        var fn = simple.mock(flag, 'remove');
        var buffer = [];

        generic.bufferConsole(
            function() {hookFlags.test.parseFlag(flag); },
            buffer
        );

        assert.equal(fn.callCount, 0);
        assert.deepEqual([], buffer);
    });
});