'use strict';

var priorityStack = function(f, queue) {
    if (f === undefined) {
        f = function(a, b) {
            if (a > b) return 1;
            if (a < b) return -1;
            return 0;
        };
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

    var newQueue = [];

    // Merge sorted lists
    var i = 0, j = 0;
    while (i < this.queue.length && j < items.length) {
        while (i < this.queue.length && this.f(this.queue[i], items[j]) <= 0) {
            newQueue.push(this.queue[i]);
            i++;
        }

        if (i >= this.queue.length) {
            break;
        }

        while (j < items.length && this.f(this.queue[i], items[j]) > 0) {
            newQueue.push(items[j]);
            j++;
        }
    }

    // Merge remaining
    if (i < this.queue.length) {
        newQueue = newQueue.concat(this.queue.slice(i));
    } else if (j < items.length) {
        newQueue = newQueue.concat(items.slice(j));
    }

    this.queue = newQueue;
};

priorityStack.prototype.pop = function(f) {
    return this.queue.pop();
};

priorityStack.prototype.peek = function(f) {
    return this.queue[this.queue.length - 1];
};

priorityStack.prototype.modify = function(f) {
    this.f = f;
    this.queue = this.queue.sort(this.f);
};

priorityStack.prototype.toArray = function() {
    return this.queue;
};

module.exports = {
    priorityStack: priorityStack
};