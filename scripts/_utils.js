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
 * Get the cost for building a creep
 */
var getCreepCost = function(parts) {
    var cost = 0;

    for (var i = 0; i < parts.length; i++) {
        if (parts[i] in BODYPART_COST) {
            cost += BODYPART_COST[parts[i]];
        }
        else {
            return -1;
        }
    }

    return cost;
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

var isFirstTurn = function() {
    if (Memory.firstTurn && Memory.firstTurn === Game.time) return true;
    if (Memory.permanent === undefined) Memory.permanent = {};

    var rooms = Object.keys(Game.rooms);
    if (Game.time === 0 || Memory.permanent.mainRoom === undefined || Game.rooms[Memory.permanent.mainRoom] === undefined) {
        Memory.permanent.firstTurn = Game.time;
        Memory.permanent.mainRoom = rooms[0];
        return true;
    }

    return false;
};

// Distance

var distance = function(x1, y1, x2, y2) {
    if (x1 instanceof Object && x1.pos instanceof RoomPosition) {
        x1 = x1.pos;
    }

    if (y1 instanceof Object && y1.pos instanceof RoomPosition) {
        y1 = y1.pos;
    }

    if (x1 instanceof RoomPosition && y1 instanceof RoomPosition) {
        y2 = y1.y;
        x2 = y1.x;
        y1 = x1.y;
        x1 = x1.x;
    }

    return Math.sqrt(
        Math.abs(Math.pow(x2 - x1, 2)) +
        Math.abs(Math.pow(y2 - y1, 2))
    );
};

var manhattenDistance = function(x1, y1, x2, y2) {
    if (x1 instanceof Object && x1.pos instanceof RoomPosition) {
        x1 = x1.pos;
    }

    if (y1 instanceof Object && y1.pos instanceof RoomPosition) {
        y1 = y1.pos;
    }

    if (x1 instanceof RoomPosition && y1 instanceof RoomPosition) {
        y2 = y1.y;
        x2 = y1.x;
        y1 = x1.y;
        x1 = x1.x;
    }

    return Math.abs(x2 - x1) + Math.abs(y2 - y1);
};

module.exports = {
    distance: distance,
    dontRepeat: dontRepeat,
    exec: exec,
    getTmp: getTmp,
    getCreepCost: getCreepCost,
    isFirstTurn: isFirstTurn,
    logOnce: logOnce,
    manhattenDistance: manhattenDistance,
};
