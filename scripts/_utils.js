var commands;

/**
 * Usage Calls command command_<parameter1> to execute its native property if available
 */
var exec = function() {
    if (arguments.length == 0) {
        throw 'Expected at least 1 parameter to execute a function';
    }

    if (!commands) {
        command = require('commands');
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
}

module.exports = {
    exec: exec,
    getTmp: getTmp,
    getCreepCost: getCreepCost,
};
