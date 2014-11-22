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

function generator(options) {
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

// It's a pain to manually type in the costs
var bodyPartCosts = {
    move: 50,
    work: 20,
    carry: 50,
    attack: 100,
    ranged_attack: 150,
    heal: 200,
    though: 5
};

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

module.exports = {
    generator: generator,
    getCreepCost: getCreepCost
};
