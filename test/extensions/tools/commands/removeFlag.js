'use strict';

var assert = require('assert');
var simple = require('simple-mock');

var generic = require("../../../../scripts/_generics.js");
var commandRemoveFlag = require("../../../../extensions/tools/commands/removeFlag");

describe('Extensions', function() {
describe('Packet tools', function() {
describe('Commands extension', function() {
describe('Command removeFlag', function() {
    it('Should remove its own flag when being called', function() {
        var flag = {
            name: 'removeFlag',
            remove: function() {}
        };

        var fn = simple.mock(flag, 'remove');
        var buffer = [];

        generic.bufferConsole(
            function() { commandRemoveFlag.exec(flag, []); },
            buffer
        );

        assert.equal(fn.callCount, 1);
        assert.deepEqual([['Flag command removeFlag: removed removeFlag']], buffer);
    });
});
});
});
});