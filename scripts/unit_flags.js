var commands = require('commands');

function parseFlag(flag) {
    var parameters = flag.name.split(" ");

    if (parameters[0] in commands) {
        commands[parameters[0]].exec(flag, parameters);
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
