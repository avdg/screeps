'use strict';

var binarySearch = function(input, value, cmp, thisArg, min, max) {
    if (typeof min !== "number") {
        min = 0;
    }

    if (typeof max !== "number") {
        max = input.length;
    }

    if (typeof cmp !== "function") {
        cmp = defaultCompare;
    }

    var piv;

    while (min !== max) {
        piv = (min + max) >> 1;
        if (cmp.call(thisArg, input[piv], value) > 0) {
            max = piv;
        } else {
            min = piv + 1;
        }
    }

    return min;
};

/**
 * Default compare function
 */
var defaultCompare = function(a, b) {
    if (a > b) return 1;
    if (a < b) return -1;
    return 0;
};

var priorityStack = function(f, queue) {
    if (f === undefined) {
        f = defaultCompare;
    }

    if (typeof f !== 'function') {
        throw new Error("Expected a function as first argument but got " + typeof f);
    }

    this.f = f;
    this.queue = (queue || []).sort(this.f);
};

priorityStack.prototype = {
    get length() {
        return this.queue.length;
    }
};

priorityStack.prototype.push = function(items) {
    if (Array.isArray(items)) {
        items = items.sort(this.f);
    } else {
        items = [items];
    }

    // If queue is empty, the list is just the sorted items
    if (this.queue.length === 0) {
        this.queue = items;
        return;
    }

    var newQueue = []; // Add all elements to this new queue
    var queuePos = 0;  // Minimum position to insert item
    var itemsPos = 0;  // Position in items

    // Add elements to newQueue
    while (itemsPos < items.length) {
        var newQueuePos = binarySearch(this.queue, items[itemsPos], this.f, undefined, itemsPos);

        // Simply concat leftovers from this.queue, then leftovers items to newQueue
        // if the items should be behind this.queue
        if (newQueuePos >= this.queue.length) {
            newQueue = newQueue.concat(
                this.queue.slice(queuePos),
                items.slice(itemsPos)
            );

            queuePos = this.queue.length;
            break;
        }

        // Add elements to new queue
        newQueue = newQueue.concat(this.queue.slice(queuePos, newQueuePos));
        newQueue.push(items[itemsPos]);

        // Update positions
        queuePos = newQueuePos;
        itemsPos++;
    }

    // Append left-overs
    newQueue = newQueue.concat(this.queue.slice(queuePos));

    this.queue = newQueue;
};

priorityStack.prototype.pop = function(f) {
    return this.queue.pop();
};

priorityStack.prototype.peek = function(f) {
    return this.queue[this.queue.length - 1];
};

priorityStack.prototype.modify = function(f) {
    if (typeof f !== 'function') {
        throw new Error("Expected a function as first argument but got " + typeof f);
    }

    this.f = f;
    this.queue = this.queue.sort(this.f);
};

priorityStack.prototype.toArray = function() {
    return this.queue;
};

module.exports = {
    binarySearch: binarySearch,
    defaultCompare: defaultCompare,
    priorityStack: priorityStack
};