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
//console.log(parseCommand('test muted sound'));
//console.log(parseCommand('test "\\\\mute\\"ed" sound'));
//console.log(parseCommand('test "mute"sound'));

module.exports = {
    generator: generator,
    getCreepCost: getCreepCost,
    parseCommand: parseCommand,
};
