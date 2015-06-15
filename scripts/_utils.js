'use strict';

/**
 * Get some temporal storage
 */
var getTmp = function() {
    if (!AI.tmp) {
        AI.tmp = {};
    }

    return AI.tmp;
};

/**
 * Checks if a certain content has been found repeating itself
 *
 * A message is found not repeating if the message wasn't used in the current
 * or previous round.
 *
 * @param string msg Message to check
 * @param string namespace Namespace for categorization
 *
 * @return true if send, false if repeating, undefined if repeating in same round
 */
var dontRepeat = function(msg, namespace) {

    // Tracker management
    if (!(Memory.dontRepeat)) {
        Memory.dontRepeat = {
            time: Game.time,
            logCurrent: {},
            logPrevious: {},
        };
    } else if (Memory.dontRepeat.time !== Game.time) {
        Memory.dontRepeat.logPrevious =
            Memory.dontRepeat.time + 1 === Game.time ?
                Memory.dontRepeat.logCurrent : {};
        Memory.dontRepeat.logCurrent = {};
        Memory.dontRepeat.time = Game.time;
    }

    // Get key
    var key = namespace.replace('_', '') + '_' + msg;

    // Run cache checks
    if (key in Memory.dontRepeat.logCurrent) return;

    Memory.dontRepeat.logCurrent[key] = true;
    return !(key in Memory.dontRepeat.logPrevious);
};

/**
 * Spamcontrolled console logging
 *
 * @param string msg
 * @param bool warn Set to false to disable
 *
 * @return true if send, false if repeating, undefined if repeating in same round
 */
var logOnce = function(msg, warn) {
    var result = dontRepeat(msg, 'log');

    if (undefined === result && true === warn)
        console.log('Warning: reusing message "' + msg + '" in same round');
    else if (result)
        console.log(msg);

    return result;
};

module.exports = {
    dontRepeat: dontRepeat,
    getTmp: getTmp,
    logOnce: logOnce,
};
