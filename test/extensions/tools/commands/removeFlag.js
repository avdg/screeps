'use strict';

var assert = require('assert');

var _ = require('lodash');
var simple = require('simple-mock');

var lib = _.merge(
    require('../../../../extensions/tools/library/commands'),
    require('../../../../extensions/tools/library/utils')
);
var hookFlags = require('../../../../extensions/tools/hooks/flags');

var commandRemoveFlag = require("../../../../extensions/tools/commands/removeFlag");

function reset() {
    global.AI = {
        extensions: {
            commands: {
                removeFlag: commandRemoveFlag
            }
        },
        parseCommand: lib.parseCommand
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

        lib.bufferConsole(
            function() { hookFlags.test.parseFlag(flag); },
            buffer
        );

        assert.equal(fn.callCount, 1);
        assert.deepEqual([['Flag command removeFlag: removed removeFlag']], buffer);
    });
});