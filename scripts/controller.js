/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('controller'); // -> 'a thing'
 */

var settings = require('_settings');

function firstTurn() {
    Memory.spawnQueue = settings.spawnQueue;
    Memory.spawnPriorityQueue = settings.spawnPriorityQueue;
}

module.exports = function() {
    if (!("spawnQueue" in Memory) || Game.time === 1) {
        firstTurn();
    }
}
