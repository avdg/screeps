'use strict';

/**
 * Returns body parts required to build the ant
 *
 * Spawn: null or spawn
 */
function build(spawn) {
    return [
        TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE
    ];
}

/**
 * Executed after ant being spawned
 */
function spawning(creep) {

}

/**
 * Executed each turn
 */
function turn(creep) {

}

/**
 * Triggered after all creeps are processed
 *
 * Usefull with a file scoped variable to store creeps and then do something
 * with all of them at once, like picking the closest creep to a certain position
 */
 function endTurn() {

 }

module.exports = {
    role: 'dummy',
    build: build,
    spawning: spawning,
    turn: turn,
    endTurn: endTurn
};
