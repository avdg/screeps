'use strict';

function command(flag, parameters) {
    AI.extensions.commands.addQueue.addQueue("spawnPriorityQueue", flag, parameters);
}

module.exports = {
    exec: command,
    command: "addPriorityQueue",
    help: 'Description:\n- Adds an ant to a spawnPriorityQueue\n\nUsage:\n- addPriorityQueue &lt;role&gt; [spawn]',
};
