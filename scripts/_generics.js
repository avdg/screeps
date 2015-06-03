'use strict';

var bufferConsole = function(f, buffer) {
    if (!Array.isArray(buffer)) {
        throw new Error("Invalid buffer given");
    }

    // Set up console replacement
    var tmp = console.log;
    console.log = function() {
        var arr = [];

        for (var i = 0; i < arguments.length; i++) {
            arr[arr.length] = arguments[i];
        }

        buffer[buffer.length] = arr;
    };

    // Catch errors so console.log still has its original value when leaving this function
    var result;
    try {
        result = f(); // Do the actual work and store result
    } catch (e) {
        console.log = tmp;
        throw e;
    }

    // Reset console
    console.log = tmp;

    return result;
};

// Just using Japanese romaji characters as building blocks :-)
var nameParts = [
     'a',  'e',  'u',  'i',  'o',
    'ka', 'ke', 'ku', 'ki', 'ko',
    'ga', 'ge', 'gu', 'gi', 'go',
    'sa', 'se', 'su', 'si', 'so',
    'za', 'ze', 'zu', 'zi', 'zo',
    'ta', 'te', 'tu', 'ti', 'to',
    'da', 'de', 'du', 'di', 'do',
    'na', 'ne', 'nu', 'ni', 'no',
    'ha', 'he', 'hu', 'hi', 'ho',
    'ba', 'be', 'bu', 'bi', 'bo',
    'pa', 'pe', 'pu', 'pi', 'po',
    'ma', 'me', 'mu', 'mi', 'mo',
    'ya',       'yu',       'yo',
    'ra', 're', 'ru', 'ri', 'ro',
    //'n'
];

var generator = function(options) {
    options = options || {};
    options.min = options.min || 2;
    options.max = options.max || 5;

    var name = '',
        i = Math.floor(Math.random() * (options.max - options.min + 1)) + options.min;

    for (; i > 0; i--) {
        name += nameParts[Math.floor(Math.random() * (nameParts.length))];
    }

    return name;
};

/**
 * Calculates and formats the time difference between two measurements
 *
 * @param start Number Time measurement on start
 * @param stop  Number Time measurement on stop
 *
 * @return Number Time difference
 */
var getTimeDiff = function(start, stop) {
    return Math.round((stop - start) * 100) / 100;
};

var parseCommand = function(command) {
    var args = [];
    var pos = 0;
    var start;
    var newPos;

    while (pos < command.length) {
        if (command[pos] === '"' || command[pos] === "'") {
            start = command[pos];
            args.push("");
            pos++;

            for (newPos = pos; newPos < command.length; newPos++) {
                if (start === command[newPos]) {
                    if (newPos + 1 < command.length && command[newPos + 1] === ' ') newPos++;
                    break;
                }
                if ('\\' === command[newPos] && newPos + 1 < command.length) newPos++;
                args[args.length - 1] += command[newPos];
            }
        } else {
            newPos = command.indexOf(" ", pos);
            if (-1 === newPos) newPos = command.length;
            args.push(command.substr(pos, newPos - pos));
        }
        pos = newPos + 1;
    }
    return args;
};

var priorityStack = function(f, queue) {
    if (f === undefined) {
        f = function(a, b) {
            if (a > b) return 1;
            if (a < b) return -1;
            return 0;
        };
    }

    if (typeof f !== 'function') {
        throw Error("Expected a function as first argument but got " + typeof f);
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
        while(i < this.queue.length && this.f(this.queue[i], items[j]) <= 0) {
            newQueue.push(this.queue[i]);
            i++;
        }

        while(j < items.length && this.f(this.queue[i], items[j]) > 0) {
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
    bufferConsole: bufferConsole,
    generator: generator,
    getTimeDiff: getTimeDiff,
    parseCommand: parseCommand,
    priorityStack: priorityStack,
};
