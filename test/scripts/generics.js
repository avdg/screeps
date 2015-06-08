'use strict';

var assert = require('assert');

var generics = require('../../scripts/_generics');

describe("Scripts: _generics", function() {
    describe("bufferConsole", function() {
        it('Should buffer console output', function() {
            var f = function () {
                console.log("Hello world!");
                return "foo";
            };
            var buffer = [];

            assert.equal(generics.bufferConsole(f, buffer), "foo");
            assert.deepEqual(buffer, [["Hello world!"]]);
        });

        it('Should expect to be given a buffer', function() {
            var f = function() {
                console.log("Hello world!");
                return "foo";
            };
            var executeWithoutBuffer = function() {
                generics.bufferConsole(f);
            };
            var check = function(e) {
                return e instanceof Error &&
                    e.message === "Invalid buffer given";
            };

            assert.throws(executeWithoutBuffer, check);
        });

        it('Should catch errors and rethrow to avoid console.log dereferences', function() {
            var backup = console.log;
            var buffer = [];
            var f = function() {
                throw Error("Error!");
            };
            var executeBufferConsole = function() {
                generics.bufferConsole(f, buffer);
            };
            var check = function(e) {
                return e instanceof Error &&
                    e.message === "Error!";
            };

            assert.throws(executeBufferConsole, check);
            assert.strictEqual(console.log, backup);
            assert.deepEqual(buffer, []);
        });
    });

    describe('generator', function() {
        it('Should return a string', function() {
            assert.equal(typeof generics.generator(), "string");
        });
    });

    describe('getTimeDiff', function() {
        it('Should return a difference', function() {
            assert.equal(generics.getTimeDiff(1, 11), 10);
        });

        it ('Should cut off decimals to 2 digits precision', function() {
            assert.equal(generics.getTimeDiff(1.12345678, 12.23456789), 11.11);
        });
    });

    describe('parseCommand', function() {
        it('Should parse these given commands without problems', function() {
            assert.deepEqual(
                generics.parseCommand('test muted sound'),
                ['test', 'muted', 'sound']
            );
            assert.deepEqual(
                generics.parseCommand('test "\\\\mute\\"ed" sound'),
                ['test', '\\mute"ed', 'sound']
            );
            assert.deepEqual(
                generics.parseCommand('test "mute"sound'),
                ['test', 'mute', 'sound']
            );
        });
        it('Should be able to handle multiple whitespaces', function() {
            assert.deepEqual(
                generics.parseCommand('   '),
                []
            );
            assert.deepEqual(
                generics.parseCommand('     test 1  2   3'),
                ['test', '1', '2', '3']
            );
        });
    });

    describe('priorityStack', function() {
        it('Must accept a function', function() {
            var invalidPriorityStackArgument = function() {
                new generics.priorityStack("blablablaah");
            };
            var check = function(e) {
                return e instanceof Error &&
                    e.message === "Expected a function as first argument but got string";
            };

            assert.throws(invalidPriorityStackArgument, check);
        });

        it('Should use the default sorter when no function is given', function() {
            var stack = new generics.priorityStack();
            stack.push(4);
            stack.push(5);
            stack.push(3);

            assert.deepEqual(stack.toArray(), [3, 4, 5]);
        });

        it('Should accept arrays second argument on construction', function() {
            var stack = new generics.priorityStack(undefined, [4, 5, 3]);
            assert.deepEqual(stack.toArray(), [3, 4, 5]);
        });

        it('Should accept arrays while pushing more items on the stack', function() {
            var stack = new generics.priorityStack();
            stack.push([4, 5, 3]);

            assert.deepEqual(stack.toArray(), [3, 4, 5]);
        });

        it('Should be able to pop off the latest in the array', function() {
            var stack = new generics.priorityStack(undefined, [4, 5, 3]);
            assert.deepEqual(stack.pop(), 5);

            assert.deepEqual(stack.toArray(), [3, 4]);
        });

        it('Should be able to provide the correct length', function() {
            var stack = new generics.priorityStack();
            assert.equal(0, stack.length);

            stack.push(4);
            assert.equal(1, stack.length);

            stack.push(5);
            assert.equal(2, stack.length);

            stack.push(3);
            assert.equal(3, stack.length);

            stack.push(6);
            assert.equal(4, stack.length);

            assert.equal(stack.pop(), 6);
            assert.equal(3, stack.length);

            assert.deepEqual(stack.toArray(), [3, 4, 5]);
        });

        it('Should be able to peek', function() {
            var stack = new generics.priorityStack();
            assert.equal(undefined, stack.peek());

            stack.push(4);
            assert.equal(4, stack.peek());

            stack.push(5);
            assert.equal(5, stack.peek());

            stack.push(3);
            assert.equal(5, stack.peek());

            stack.push(6);
            assert.equal(6, stack.peek());

            assert.equal(stack.pop(), 6);
            assert.equal(5, stack.peek());

            assert.deepEqual(stack.toArray(), [3, 4, 5]);
        });

        it('Should be able to be used by a custom compare function', function() {
            var f = function(a, b) {
                if (a > b) return -1;
                if (a < b) return 1;
                return 0;
            };

            var stack = new generics.priorityStack(f, [4, 3, 5]);
            assert.deepEqual(stack.toArray(), [5, 4, 3]);
        });

        it('Should be able to modify itself with a new function', function() {
            var f = function(a, b) {
                if (a > b) return -1;
                if (a < b) return 1;
                return 0;
            };

            var stack = new generics.priorityStack(undefined, [4, 3, 5]);
            assert.deepEqual(stack.toArray(), [3, 4, 5]);

            stack.modify(f);
            assert.deepEqual(stack.toArray(), [5, 4, 3]);
        });
    });
});