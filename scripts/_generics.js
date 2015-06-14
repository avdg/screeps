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

        while (command[pos] === " ") {
            pos++;
        }

        if (command.length <= pos) {
            break;
        }

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

module.exports = {
    bufferConsole: bufferConsole,
    getTimeDiff: getTimeDiff,
    parseCommand: parseCommand,
};
