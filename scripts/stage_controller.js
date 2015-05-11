'use strict';

var settings = require('_settings');
var units = AI.extensions.units;

function unitIterator(f) {
    var unit;
    for (unit in units) {
        units[unit][f]();
    }
}

function firstTurn() {
    console.log('Controller: Memory reset');
    for (var item in Memory) {
        if (item === "creeps" && Memory.creeps) {
            for (var sub in Memory.creeps) {
                delete Memory.creeps[sub];
            }
            continue;
        }
        if (item === "permanent") continue;
        delete Memory[item];
    }
    console.log('Controller: Memory reset');

    Memory.spawnQueue = settings.spawnQueue;
    Memory.spawnPriorityQueue = settings.spawnPriorityQueue;
    Memory.spawns = {};
    Memory.sources = {};
}

function pre() {
    if (AI.isFirstTurn()) {
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
