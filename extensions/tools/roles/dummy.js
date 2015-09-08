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
 * Executed after each tick while creep is being spawned.
 */
function spawning(creep) {

}

/**
 * Executed each non-spawning turn
 */
function turn(creep) {

    // Always drop when dying. Uses a routine to simplify code reuse between multiple creep roles.
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
