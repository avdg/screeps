'use strict';

var generics = require('_generics');

function parseFlag(flag) {
    var parameters = generics.parseCommand(flag.name);

    if (parameters[0] in Game.extensions.commands) {
        Game.extensions.commands[parameters[0]].exec(flag, parameters);
    }
}

function preController() {
    for (var flag in Game.flags) {
        parseFlag(Game.flags[flag]);
    }
}

function postController() {

}

module.exports = {
    preController: preController,
    postController: postController,
};
