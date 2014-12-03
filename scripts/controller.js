/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('controller'); // -> 'a thing'
 */

var settings = require('_settings');
var units = require('units');

function unitIterator(f) {
    var unit;
    for (unit in units) {
        units[unit][f]();
    }
}

function firstTurn() {
    Memory.spawnQueue = settings.spawnQueue;
    Memory.spawnPriorityQueue = settings.spawnPriorityQueue;
}

function pre() {
    if (!("spawnQueue" in Memory) || Game.time === 0) {
        firstTurn();
    }

    unitIterator("preController");
}

function post() {
    unitIterator("postController");
}

module.exports = {
    pre: pre,
    post: post,
};
