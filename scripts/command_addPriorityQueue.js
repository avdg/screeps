var addQueue = require('command_addQueue').addQueue;

function command(flag, parameters) {
    addQueue("spawnPriorityQueue", flag, parameters);
}

module.exports = {
    exec: command,
    command: "addPriorityQueue",
};
