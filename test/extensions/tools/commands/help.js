'use strict';

var assert = require('assert');
var simple = require('simple-mock');

var generic = require('../../../../scripts/_generics.js');
var hookFlags = require('../../../../extensions/tools/hooks/flags');

reset();
var commandHelp = require('../../../../extensions/tools/commands/help.js');

function reset() {
    require('../../../../lib/mocks/gameStateStart')();
    global.AI = {
        extensions: {
            commands: {
                help: commandHelp
            }
        },
        parseCommand: generic.parseCommand
    };
}

describe('Tool extensions: Command help', function() {
    beforeEach(reset);

    it('Should print a help message about the help command if no parameters are given', function() {
        var flag = {
            name: 'help',
            remove: function() {}
        };

        var fn = simple.mock(flag, 'remove');
        var buffer = [];

        generic.bufferConsole(
            function() { hookFlags.test.parseFlag(flag); },
            buffer
        );

        assert.equal(fn.callCount, 1);
        assert.deepEqual([["Flag command help:\n\nAvailable commands:\nhelp\n\nUse \"help &lt;command&gt;\" for more information"]], buffer);
    });

    it('Should give a warning when requesting help from a non-existing command', function() {
        var flag = {
            name: 'help non-existing',
            remove: function() {}
        };

        var fn = simple.mock(flag, 'remove');
        var buffer = [];

        generic.bufferConsole(
            function() { hookFlags.test.parseFlag(flag); },
            buffer
        );

        assert.equal(fn.callCount, 1);
        assert.deepEqual([["Flag command help: Command non-existing not found"]], buffer);
    });

    it('Should give a help message when requesting help from an existing command with help message', function() {
        var flag = {
            name: 'help help',
            remove: function() {}
        };

        var fn = simple.mock(flag, 'remove');
        var buffer = [];

        generic.bufferConsole(
            function() { hookFlags.test.parseFlag(flag); },
            buffer
        );

        assert.equal(fn.callCount, 1);
        assert.deepEqual([["Flag command help:\n=== help ===\nDescription:\n- Shows users how to use a command\n\nUsages:\n- help [&lt;command&gt;]"]], buffer);
    });

    it('Should give a warning when requesting help from an existing command without help message', function() {
        AI.extensions.commands.virtualCommand = {
            exec: function(flag) { return; },
            command: 'virtualCommand'
        };

        var flag = {
            name: 'help virtualCommand',
            remove: function() {}
        };

        var fn = simple.mock(flag, 'remove');
        var buffer = [];

        generic.bufferConsole(
            function() { hookFlags.test.parseFlag(flag); },
            buffer
        );

        assert.equal(fn.callCount, 1);
        assert.deepEqual([['Flag command help: Command virtualCommand exists, but has no help message']], buffer);
    });

    it('Should provide simular commands for non-existing command if they are available', function() {
        AI.extensions.commands.FooBar = {
            exec: function(flag) { return; },
            command: 'FooBar'
        };

        var flag = {
            name: 'help Foo',
            remove: function() {}
        };

        var fn = simple.mock(flag, 'remove');
        var buffer = [];

        generic.bufferConsole(
            function() { hookFlags.test.parseFlag(flag); },
            buffer
        );

        assert.equal(fn.callCount, 1);
        assert.deepEqual([["Flag command help: Command Foo not found\n\nSimilar commands:\nFooBar\n\nUse \"help &lt;command&gt;\" for more information"]], buffer);
    });

    it('Should provide simular commands for non-existing command if they are available (case insensitive)', function() {
        AI.extensions.commands.FooBar = {
            exec: function(flag) { return; },
            command: 'FooBar'
        };

        var flag = {
            name: 'help fOO',
            remove: function() {}
        };

        var fn = simple.mock(flag, 'remove');
        var buffer = [];

        generic.bufferConsole(
            function() { hookFlags.test.parseFlag(flag); },
            buffer
        );

        assert.equal(fn.callCount, 1);
        assert.deepEqual([["Flag command help: Command fOO not found\n\nSimilar commands:\nFooBar\n\nUse \"help &lt;command&gt;\" for more information"]], buffer);
    });
});