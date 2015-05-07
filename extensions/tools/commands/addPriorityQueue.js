'use strict';

function command(flag, parameters) {
    Game.extensions.commands.addQueue("spawnPriorityQueue", flag, parameters);
}

module.exports = {
    exec: command,
    command: "addPriorityQueue",
    help: 'Description:\n- Adds an ant to a spawnPriorityQueue\n\nUsage:\n- addPriorityQueue &lt;role&gt;',
};
