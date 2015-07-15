'use strict';

function setupAiLibrary() {
    for (var i in AI.extensions.library) {
        for (var j in AI.extensions.library[i]) {
            AI[j] = AI.extensions.library[i][j];
        }
    }

    AI.reset = function() {
        for (var i in AI.extensions.library) {
            if (typeof AI.extensions.library[i] === "function") {
                AI.extensions.library[i].reset();
            }
        }
    };
}

function setupSpawn(spawn) {
    Memory.spawns[spawn] = {};
    Memory.spawns[spawn].spawnPriorityQueue = [];
    Memory.spawns[spawn].spawnQueue = [];
}

function firstTurn() {
    for (var item in Memory) {
        if (item === "creeps") {
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
}

module.exports = function() {
    setupAiLibrary();
    if (AI.isFirstTurn()) firstTurn();
    setup();
};