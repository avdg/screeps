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
    Memory.creeps[creep].copyOnDeath = false;
};

var deathChecker = function() {

    for (var i in Memory.creeps) {

        if (Game.creeps[i]) {
            continue; // Ignore when creep is found alive
        }

        if (AI.settings.deathChecker.ignore.indexOf(Memory.creeps[i].role) !== -1 ||
            ("copyOnDeath" in Memory.creeps[i] && Memory.creeps[i].copyOnDeath === false)
        ) {
            console.log('Hook deathChecker: Found dead creep ' + i + '. Deleting...');
            removeQueue.push(i);

        } else if (AI.settings.deathChecker.copy.indexOf(Memory.creeps[i].role) !== -1) {
            queueCreep(i, false);

        } else if (AI.settings.deathChecker.copyPriority.indexOf(Memory.creeps[i].role) !== -1) {
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
    postController: postController
};
