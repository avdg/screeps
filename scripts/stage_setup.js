'use strict';

function setupSpawn(spawn) {
    Memory.spawns[spawn] = {};
    Memory.spawns[spawn].spawnPriorityQueue = [];
    Memory.spawns[spawn].spawnQueue = [];
}

function firstTurn() {
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

    Memory.spawnQueue = AI.settings.spawnQueue;
    Memory.spawnPriorityQueue = AI.settings.spawnPriorityQueue;
    Memory.spawns = {};
    Memory.sources = {};

    console.log('Controller: Memory reset');
}

function setup() {
    for (var spawn in Game.spawns) {
        if (typeof Memory.spawns[spawn] !== "object") {
            setupSpawn(spawn);
        }
    }

    // It gets what it gets, otherwise it will digg to get it
    Room.prototype.get = function(type, options) {
        if (typeof AI.extensions.targets[type] === "object" &&
            typeof AI.extensions.targets[type].get === "function"
        ) return AI.extensions.targets[type].get(this, options);
    };

    AI.get = function(type, options) {
        if (typeof AI.extensions.targets[type] === "object" &&
            typeof AI.extensions.targets[type].get === "function"
        ) return AI.extensions.targets[type].get(undefined, options);
    };
}

module.exports = function() {
    if (AI.isFirstTurn()) firstTurn();
    setup();
};