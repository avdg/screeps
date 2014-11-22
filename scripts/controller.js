/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('controller'); // -> 'a thing'
 */

function firstTurn() {
    // TODO insert first ants to spawn
    Memory.spawnQueue = ['FOO'];
}

module.exports = function() {
    if (Memory.spawnQueue === undefined || Game.time === 0) {
        firstTurn();
    }
}
