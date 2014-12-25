var commands;

/**
 * Usage Calls command command_<parameter1> to execute its native property if available
 */
var exec = function() {
    if (arguments.length === 0) {
        throw 'Expected at least 1 parameter to execute a function';
    }

    if (!commands) {
        commands = require('commands');
    }

    var cmd = arguments[0];

    if (cmd in commands && "native" in commands[cmd]) {
        return commands[cmd].native.apply(null, arguments);
    } else {
        throw 'Command not found';
    }
};

/**
 * Get some temporal storage
 */
var getTmp = function() {
    if (!Game.tmp) {
        Game.tmp = {};
    }

    return tmp;
};

/**
 * Get the cost for building a creep
 */
var getCreepCost = function(parts) {
    var cost = 0;

    for (var i = 0; i < parts.length; i++) {
        if (parts[i] in Game.BODYPART_COST) {
            cost += Game.BODYPART_COST[parts[i]];
        }
        else {
            return -1;
        }
    }

    return cost;
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

    if (undefined === result && false !== warn)
        console.log('Warning: reusing message "' + msg + '" in same round');
    else if (result)
        console.log(msg);

    return result;
};

var isFirstTurn = function() {
    return !("spawnQueue" in Memory) || Game.time === 0;
};

module.exports = {
    exec: exec,
    getTmp: getTmp,
    getCreepCost: getCreepCost,
    dontRepeat: dontRepeat,
    logOnce: logOnce,
    isFirstTurn: isFirstTurn,
};
