/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role_FOO'); // -> 'a thing'
 */


/**
 * Returns body parts required to build the ant
 *
 * Spawn: null or spawn
 */
function spawn(spawn) {
    return [Game.TOUGH];
}

/**
 * Executed after ant being spawned
 */
function init(name) {

}

/**
 * Executed each turn
 */
function turn (creep) {

}

module.exports = {
    role: 'FOO',
    spawn: spawn,
    init: init,
    turn: turn,
};
