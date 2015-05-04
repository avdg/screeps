'use strict';

function command(flag, parameters) {
    for (var creep in Game.creeps) {
        Game.creeps[creep].suicide();
    }

    flag.remove();
}

module.exports = {
    exec: command,
    command: "killAll",
    help: 'Description:\n- Kills all creeps\n\nUsage:\n- killAll',
};
