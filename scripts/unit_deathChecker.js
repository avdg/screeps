'use strict';

var settings = require('_settings');
var utils = require('_utils');

// Required settings:
// deathChecker.ignore = ['FOO'] Roles in this array shouldn't be replaced
// deathChecker.copy = ['BAR'] Roles in this array should be replaced
//
// Notes:
// - If a role has been found death and has not been found in either arrays
//   the chat might spam because the deathChecker doesn't know what to do
//
// - If you want to prevent a creep from being copied when it dies,
//   set memory property 'copyOnDeath' to false

var removeQueue = [];

var deathChecker = function() {

    for (var i in Memory.creeps) {

        if (Game.creeps[i]) {
            continue; // Ignore when creep is found alive
        }

        if (settings.deathChecker.ignore.indexOf(Memory.creeps[i].role) !== -1 ||
            ("copyOnDeath" in Memory.creeps[i] && Memory.creeps[i].copyOnDeath === false)
        ) {
            console.log('Unit deathChecker: Found dead creep ' + i + '. Deleting...');
            removeQueue.push(i);
        } else if (settings.deathChecker.copy.indexOf(Memory.creeps[i].role) !== -1) {
            console.log('Unit deathChecker: Found dead creep ' + i + '. Copying...');
            utils.exec('creepClone', {
                /* Fake creep object*/
                role: Memory.creeps[i].role,
                memory: Memory.creeps[i]
            }, true);
            removeQueue.push(i);
        } else {
            console.log('Unit deathChecker: Found dead creep ' + i + '. Dunno what to do...');
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
