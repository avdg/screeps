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

module.exports = {
    bufferConsole: bufferConsole,
    getTimeDiff: getTimeDiff,
};
