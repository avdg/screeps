'use strict';

var assert = require('assert');

var _ = require('lodash');
var simple = require('simple-mock');

var lib = _.merge(
    require('../../../../extensions/tools/library/commands'),
    require('../../../../extensions/tools/library/utils')
);
var hookFlags = require("../../../../extensions/tools/hooks/flags");

var commandCamp = require("../../../../extensions/tools/commands/camp");

function reset() {
    global.AI = {
        extensions: {
            commands: {
                camp: commandCamp
            }
        },
        parseCommand: lib.parseCommand
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

        lib.bufferConsole(
            function() {hookFlags.test.parseFlag(flag); },
            buffer
        );

        assert.equal(fn.callCount, 0);
        assert.deepEqual([], buffer);
    });
});