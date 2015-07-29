'use strict';

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

    if (this.queue.length === 0) {
        this.queue = items;
        return;
    }

    var newQueue = [];

    var min = 0; // Minimum position to insert item
    var max;     // Maximum position to insert item
    var pos = 0; // Position in items

    while (pos < items.length) {
        max = this.queue.length - 1; // Max position where item can be
        var oldMin = min;

        // Do bisect (illustration added for pointing device purposes to aid insertion algorithm understanding)
        // +---+---+---+---+---+---+
        // | 1 | 2 | 3 | 5 | 7 | 9 |
        // +---+---+---+---+---+---+

        // Check if item can be inserted at the last position, so pivot doesn't overflow this.queue
        if (this.f(this.queue[max], items[pos]) < 0) {
            newQueue = newQueue.concat(
                this.queue.slice(min),
                items.slice(pos)
            );

            min = this.queue.length;
            break;
        }

        // Locate insertion position
        while (min !== max) {
            var pivot = Math.ceil((min + max) / 2);

            // Raise minimum at pivot (new insert position) if queue at pivot is smaller or equal
            if (this.f(this.queue[pivot], items[pos]) <= 0) {
                min = pivot;

            // Lower maximum below pivot if queue at pivot is bigger than item to insert
            // (max refers to max position the item possibly can take)
            } else {
                max = pivot - 1;
            }
        }

        // Add elements to new queue
        newQueue = newQueue.concat(this.queue.slice(oldMin, min - oldMin));
        newQueue.push(items[pos]);

        pos++;
    }

    // Append left-overs
    newQueue = newQueue.concat(this.queue.slice(min));

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
    priorityStack: priorityStack,
    defaultCompare: defaultCompare
};