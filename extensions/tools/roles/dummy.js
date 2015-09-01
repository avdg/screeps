'use strict';

/**
 * Returns body parts required to build the ant
 *
 * Spawn: null or spawn
 */
function build(spawn) {
    return [
        WORK, CARRY, MOVE, MOVE
    ];
}

/**
 * Executed each tick while creep is being spawned.
 */
function spawning(creep) {

}

/**
 * Executed each tick after creep is spawned.
 */
function turn(creep) {

    // Use routines to abstract and share behaviors between creeps.
    if (creep.do("deadCheck", {}) === true) {
        return;
    }

    // Do other stuff...
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
