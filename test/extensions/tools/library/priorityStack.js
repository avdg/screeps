'use strict';

var assert = require('assert');
var lib = require('../../../../extensions/tools/library/priorityStack');

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
});