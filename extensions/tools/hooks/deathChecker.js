'use strict';

// Required settings:
// deathChecker.ignore = ['FOO'] Roles in this array shouldn't be replaced
// deathChecker.copy = ['BAR'] Roles in this array should be replaced
// deathChecker.copyPriority = ['FOOBAR'] Roles in this array should be replaced quickly
//
// Notes:
// - If a role has been found death and has not been found in either arrays
//   the chat might spam because the deathChecker doesn't know what to do
//
// - If you want to prevent a creep from being copied when it dies,
//   set memory property 'copyOnDeath' to false
var removeQueue = [];

var queueCreep = function(creep, priority) {
    console.log('Hook deathChecker: Found dead creep ' + creep + '. Copying to ' + (priority ? "priority ":"") + "queue...");

    // Clone creep to spawn queue
    AI.exec('creepClone', {
        role: Memory.creeps[creep].role,
        memory: _.clone(Memory.creeps[creep])
    }, priority);

    // Mark cloning as done
    removeQueue.push(creep);
    Memory.creeps[creep].copyOnDeath = "ignore";
};

var deathChecker = function() {

    // Precompile checklist
    var action = {};
    var addToAction = function(type) {
        return function(key) {
            action[key] = type;
        };
    };

    AI.settings.deathChecker.ignore.forEach(addToAction("ignore"));
    AI.settings.deathChecker.copy.forEach(addToAction("copy"));
    AI.settings.deathChecker.copyPriority.forEach(addToAction("copyPriority"));

    var mode;
    for (var i in Memory.creeps) {

        // Ignore when creep is found alive
        if (Game.creeps[i]) {
            continue;
        }

        mode = undefined;

        // Check creep memory
        if (Memory.creeps[i].copyOnDeath !== undefined &&
            [false, 'ignore', 'copy', 'copyPriority'].indexOf(Memory.creeps[i].copyOnDeath) !== -1
        ) {
            mode = Memory.creeps[i].copyOnDeath === false ? 'ignore' : Memory.creeps[i].copyOnDeath;
        }

        // Use role default when no value found
        if (mode === undefined) {
            mode = action[Memory.creeps[i].role];
        }

        if (mode === "ignore") {
            console.log('Hook deathChecker: Found dead creep ' + i + '. Deleting...');
            removeQueue.push(i);

        } else if (mode === "copy") {
            queueCreep(i, false);

        } else if (mode === "copyPriority") {
            queueCreep(i, true);

        } else {
            console.log('Hook deathChecker: Found dead creep ' + i + '. Dunno what to do...');
        }
    }

};

var removeDeaths = function() {
    for (var i = 0; i < removeQueue.length; i++) {
        delete Memory.creeps[removeQueue[i]];
    }
};

function preController() {
    deathChecker();
}

function postController() {
    removeDeaths();
}

module.exports = {
    preController: preController,
    postController: postController,
    test: {
        get removeQueue() { return removeQueue; },
        set removeQueue(value) { removeQueue = value; },
        queueCreep: queueCreep
    }
};
