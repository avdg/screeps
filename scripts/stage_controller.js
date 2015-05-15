'use strict';

function unitIterator(f) {
    var hook;
    for (hook in AI.extensions.hooks) {
        if (typeof AI.extensions.hooks[hook][f] === "function") {
            AI.extensions.hooks[hook][f]();
        }
    }
}

function firstTurn() {
    unitIterator("firstTurn");

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

    Memory.spawnQueue = AI.settings.spawnQueue;
    Memory.spawnPriorityQueue = AI.settings.spawnPriorityQueue;
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
