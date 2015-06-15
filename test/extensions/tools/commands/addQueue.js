'use strict';

var assert = require('assert');

var _ = require('lodash');
var simple = require('simple-mock');

var lib = _.merge(
    require('../../../../extensions/tools/library/commands'),
    require('../../../../extensions/tools/library/utils')
);
var hookFlags = require('../../../../extensions/tools/hooks/flags');

// Command addQueue has library for both addQueue and addPriorityQueue
var commandAddPriorityQueue = require('../../../../extensions/tools/commands/addPriorityQueue.js');
var commandAddQueue = require('../../../../extensions/tools/commands/addQueue.js');

function reset() {
    global.AI = {
        extensions: {
            commands: {
                addPriorityQueue: commandAddPriorityQueue,
                addQueue: commandAddQueue
            },
            roles: {
                foo: {}
            }
        },
        parseCommand: lib.parseCommand
    };
    global.Memory = {};
}

describe('Tool extensions: Command addPriorityQueue and addQueue', function() {
    beforeEach(reset);

    it('Should give error if not enough parametes are given', function() {
        var flag = {
            name: 'addQueue',
            remove: function() {}
        };

        var fn = simple.mock(flag, 'remove');
        var buffer = [];

        lib.bufferConsole(
            function() { hookFlags.test.parseFlag(flag); },
            buffer
        );

        assert.equal(fn.callCount, 1);
        assert.deepEqual([['Flag command addQueue: addQueue command has not enough parameters']], buffer);
    });

    it('Should give error if role does not exist', function() {
        var flag = {
            name: 'addQueue unknown',
            remove: function() {}
        };

        var fn = simple.mock(flag, 'remove');
        var buffer = [];

        lib.bufferConsole(
            function() { hookFlags.test.parseFlag(flag); },
            buffer
        );

        assert.equal(fn.callCount, 1);
        assert.deepEqual([["Flag command addQueue: can not find role unknown"]], buffer);
    });

    it('Should put an order in the queue', function() {
        var flag = {
            name: 'addQueue foo',
            remove: function() {}
        };
        Memory.spawnQueue = ['bar'];

        var fn = simple.mock(flag, 'remove');
        var buffer = [];

        lib.bufferConsole(
            function() { hookFlags.test.parseFlag(flag); },
            buffer
        );

        assert.equal(fn.callCount, 1);
        assert.deepEqual(["bar", "foo"], Memory.spawnQueue);
        assert.deepEqual([["Flag command addQueue: added foo to spawnQueue"]], buffer);
    });

    it('Should put an order in a new queue', function() {
        var flag = {
            name: 'addQueue foo',
            remove: function() {}
        };

        var fn = simple.mock(flag, 'remove');
        var buffer = [];

        lib.bufferConsole(
            function() { hookFlags.test.parseFlag(flag); },
            buffer
        );

        assert.equal(fn.callCount, 1);
        assert.deepEqual(["foo"], Memory.spawnQueue);
        assert.deepEqual([["Flag command addQueue: added foo to spawnQueue"]], buffer);
    });

    it('Should put an order in a new priorityQueue', function() {
        var flag = {
            name: 'addPriorityQueue foo',
            remove: function() {}
        };

        var fn = simple.mock(flag, 'remove');
        var buffer = [];

        lib.bufferConsole(
            function() { hookFlags.test.parseFlag(flag); },
            buffer
        );

        assert.equal(fn.callCount, 1);
        assert.deepEqual(["foo"], Memory.spawnPriorityQueue);
        assert.deepEqual([["Flag command addPriorityQueue: added foo to spawnPriorityQueue"]], buffer);
    });
});