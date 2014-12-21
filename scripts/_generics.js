/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('_generics'); // -> 'a thing'
 */

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
    options.max = options.max || 8;

    var name = '',
        i = Math.floor(Math.random() * (options.max - options.min + 1)) + options.min;

    for (; i > 0; i--) {
        name += nameParts[Math.floor(Math.random() * (nameParts.length))];
    }

    return name;
}

var bodyPartCosts = Game.BODYPART_COST;

var getCreepCost = function(parts) {
    var cost = 0;

    for (var i = 0; i < parts.length; i++) {
        if (parts[i] in bodyPartCosts) {
            cost += bodyPartCosts[parts[i]];
        }
        else {
            return -1;
        }
    }

    return cost;
}

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
}

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
}

module.exports = {
    generator: generator,
    getCreepCost: getCreepCost,
    parseCommand: parseCommand,
    dontRepeat: dontRepeat,
    logOnce: logOnce,
    isFirstTurn: isFirstTurn,
};
