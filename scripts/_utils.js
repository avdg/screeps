'use strict';

/**
 * Usage Calls command command_<parameter1> to execute its native property if available
 */
var exec = function() {
    if (arguments.length === 0) {
        throw new Error('Expected at least 1 parameter to execute a function');
    }

    var commands = AI.extensions.commands;

    var cmd = arguments[0];

    if (commands[cmd] === undefined) {
        throw new Error("Command " + cmd + " doesn't exist");
    }

    if (commands[cmd].native !== undefined && typeof commands[cmd].native === "function") {
        return commands[cmd].native.apply(null, arguments);
    } else {
        throw new Error("Can't execute command " + cmd + " natively");
    }
};

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

var firstTurnCache;
var isFirstTurn = function() {
    // Check for cache hits
    if (firstTurnCache !== undefined)
        return firstTurnCache;

    // Make sure memory is set
    if (Memory.permanent === undefined)
        Memory.permanent = { restarts : [] }; // Log restarts for debugging

    // Get spawns to compare later
    var oldSpawnIds = Memory.permanent.spawnIds;
    Memory.permanent.spawnIds = Object.keys(Game.spawns).map(
        function(s) {
            return Game.spawns[s].id;
        }
    ).sort();

    // In case the old value isn't an array
    if (!Array.isArray(oldSpawnIds)) {
        Memory.permanent.firstTurn = Game.time;
        Memory.permanent.restarts.push({start: Game.time, spawns: Memory.permanent.spawnIds});
        return (firstTurnCache = true);
    }

    // Check for spawn matches
    var hasSpawnId = false;
    for (var i = oldSpawnIds.length; i >= 0; i--) {
        if (Memory.permanent.spawnIds.indexOf(oldSpawnIds[i]) > -1) {
            hasSpawnId = true;
        }
    }

    // Not the first turn if at least one spawn matches
    if (hasSpawnId) {
        return (firstTurnCache = false);
    }

    // We seem to be reset, we have to start from scratch!

    // False positive check to avoid memory being filled with restarts
    if ((Game.time - Memory.permanent.firstTurn) < 10) {
        if (Memory.permanent.multipleRestartsSince === undefined) {
            Memory.permanent.multipleRestartsSince = Game.time;
        }

        Memory.permanent.firstTurn = Game.time;
        return (firstTurnCache = true);
    }

    var data = {start: Game.time, spawns: Memory.permanent.spawnIds};
    if (Memory.permanent.multipleRestartsSince !== undefined) {
        data.multipleRestartsSince = Memory.permanent.multipleRestartsSince;
    }

    Memory.permanent.firstTurn = Game.time;
    Memory.permanent.restarts.push(data);
    Memory.permanent.multipleRestartsSince = undefined;
    return (firstTurnCache = true);
};

module.exports = {
    dontRepeat: dontRepeat,
    exec: exec,
    getTmp: getTmp,
    isFirstTurn: isFirstTurn,
    logOnce: logOnce,

    test: {
        set firstTurnCache (value) { firstTurnCache = value; },
        get firstTurnCache () { return firstTurnCache; }
    }
};
