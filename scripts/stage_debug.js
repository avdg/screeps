/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports = 'a thing';
 *
 * You can import it in main and use it as follow:
 * var debug = require('debug');
 *
 * debug();
 */
var settings = require('_settings');

function printStatus() {
    if (Game.time % settings.statusFrequency !== 0) {
        return;
    }

    var msg = '';
    msg += "***** Round " + Game.time + " *****" + "\n\n";
    msg += "Number of spawn: " + Object.keys(Game.spawns).length + "\n";
    msg += "Number of creeps: " + Object.keys(Game.creeps).length + "\n";
    msg += "Number of flags: " + Object.keys(Game.flags).length + "\n";

    console.log(msg);
}

module.exports = function() {
    printStatus();
};
