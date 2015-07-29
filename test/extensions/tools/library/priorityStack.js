'use strict';

var assert = require('assert');
var lib = require('../../../../extensions/tools/library/priorityStack');

describe('Library extensions: priorityStack', function() {
    describe('defaultCompare', function() {
        var testCases = [
            [1, 3, -1],
            [3, 1,  1],
            [1, 1,  0]
        ];

        function runTest(test) {
            return function() {
                it("Should return " + test[2] + " if inputs are " + test[0] + " and " + test[1], function() {
                    assert.strictEqual(lib.defaultCompare(test[0], test[1]), test[2]);
                });
            };
        }

        for (var i = 0; i < testCases.length; i++) {
            runTest(testCases[i])();
        }
    });

    describe('priorityStack', function() {
        it('Must accept a function', function() {
            var invalidPriorityStackArgument = function() {
                new lib.priorityStack("blablablaah");
            };
            var check = function(e) {
                return e instanceof Error &&
                    e.message === "Expected a function as first argument but got string";
            };

            assert.throws(invalidPriorityStackArgument, check);
        });

        it('Should use the default sorter when no function is given', function() {
            var stack = new lib.priorityStack();
            stack.push(4);
            stack.push(5);
            stack.push(3);

            assert.deepEqual(stack.toArray(), [3, 4, 5]);
        });

        it('Should accept arrays second argument on construction', function() {
            var stack = new lib.priorityStack(undefined, [4, 5, 3]);
            assert.deepEqual(stack.toArray(), [3, 4, 5]);
        });

        it('Should accept arrays while pushing more items on the stack', function() {
            var stack = new lib.priorityStack();
            stack.push([4, 5, 3]);

            assert.deepEqual(stack.toArray(), [3, 4, 5]);
        });

        it('Should be able to pop off the latest in the array', function() {
            var stack = new lib.priorityStack(undefined, [4, 5, 3]);
            assert.deepEqual(stack.pop(), 5);

            assert.deepEqual(stack.toArray(), [3, 4]);
        });

        it('Should be able to accept an array when priorityStack already has some items', function() {
            var stack = new lib.priorityStack();
            stack.push([1, 6, 8, 10, 12, 13, 25, 103]);
            assert.deepEqual(stack.toArray(), [1, 6, 8, 10, 12, 13, 25, 103]);

            stack.push([7, 9, 11, 24, 36, 43, 57]);
            assert.deepEqual(stack.toArray(), [1, 6, 7, 8, 9, 10, 11, 12, 13, 24, 25, 36, 43, 57, 103]);

            stack.push([17, 23, 3, 57]);
            assert.deepEqual(stack.toArray(), [1, 3, 6, 7, 8, 9, 10, 11, 12, 13, 17, 23, 24, 25, 36, 43, 57, 57, 103]);
        });

        it('Should be able to have a lot of items pushed', function() {
            var stack = new lib.priorityStack();

            stack.push(5);
            assert.deepEqual(stack.toArray(), [5]);

            stack.push(7);
            assert.deepEqual(stack.toArray(), [5, 7]);

            stack.push(98);
            assert.deepEqual(stack.toArray(), [5, 7, 98]);

            stack.push(76);
            assert.deepEqual(stack.toArray(), [5, 7, 76, 98]);

            stack.push(3);
            assert.deepEqual(stack.toArray(), [3, 5, 7, 76, 98]);

            stack.push(21);
            assert.deepEqual(stack.toArray(), [3, 5, 7, 21, 76, 98]);

            stack.push(42);
            assert.deepEqual(stack.toArray(), [3, 5, 7, 21, 42, 76, 98]);

            stack.push(33);
            assert.deepEqual(stack.toArray(), [3, 5, 7, 21, 33, 42, 76, 98]);
        });

        it('Should be able to provide the correct length', function() {
            var stack = new lib.priorityStack();
            assert.equal(0, stack.length);

            stack.push(4);
            assert.equal(1, stack.length);

            stack.push(5);
            assert.equal(2, stack.length);

            stack.push(3);
            assert.equal(3, stack.length);

            stack.push(6);
            assert.equal(4, stack.length);

            assert.deepEqual(stack.toArray(), [3, 4, 5, 6]);

            assert.equal(stack.pop(), 6);
            assert.equal(3, stack.length);

            assert.deepEqual(stack.toArray(), [3, 4, 5]);
        });

        it('Should be able to peek', function() {
            var stack = new lib.priorityStack();
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

            var stack = new lib.priorityStack(f, [4, 3, 5]);
            assert.deepEqual(stack.toArray(), [5, 4, 3]);
        });

        it('Should be able to modify itself with a new function', function() {
            var f = function(a, b) {
                if (a > b) return -1;
                if (a < b) return 1;
                return 0;
            };

            var stack = new lib.priorityStack(undefined, [4, 3, 5]);
            assert.deepEqual(stack.toArray(), [3, 4, 5]);

            stack.modify(f);
            assert.deepEqual(stack.toArray(), [5, 4, 3]);
        });

        it('Should be not able to modify itself if passed parameter is not a function', function() {
            var stack = new lib.priorityStack(undefined, [1, 2, 3]);

            var invalidModifyArgument = function() {
                stack.modify("This is not a function");
            };
            var check = function(e) {
                return e instanceof Error &&
                    e.message === "Expected a function as first argument but got string";
            };

            assert.throws(invalidModifyArgument, check);

        });

        it('Should run this without problems', function() {
            var f = function(a, b) {
                assert.strictEqual(typeof a.value, "number");
                assert.strictEqual(typeof b.value, "number");
                return a.value - b.value;
            };

            var stack = new lib.priorityStack(f);
            stack.push({value: 1});
            stack.push({value: 7});
        });
    });
});