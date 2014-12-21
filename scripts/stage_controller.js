/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('controller'); // -> 'a thing'
 */

var generics = require('_generics');
var settings = require('_settings');
var units = require('units');

function unitIterator(f) {
    var unit;
    for (unit in units) {
        units[unit][f]();
    }
}

function firstTurn() {
    console.log('Controller: Memory reset');
    for (var item in Memory) {
        if (item == "creeps" && Memory.creeps) {
            for (var sub in Memory.creeps) {
                delete Memory.creeps[sub];
            }
            continue;
        }
        delete Memory[item];
    }
    console.log('Controller: Memory reset');

    Memory.spawnQueue = settings.spawnQueue;
    Memory.spawnPriorityQueue = settings.spawnPriorityQueue;
}

function pre() {
    if (generics.isFirstTurn()) {
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
