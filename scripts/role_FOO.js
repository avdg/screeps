'use strict';

/**
 * Returns body parts required to build the ant
 *
 * Spawn: null or spawn
 */
function build(spawn) {
    return [TOUGH];
}

/**
 * Executed after ant being spawned
 */
function init(name) {

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
    role: 'FOO',
    build: build,
    init: init,
    turn: turn,
    endTurn: endTrun,
};
