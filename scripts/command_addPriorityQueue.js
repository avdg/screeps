'use strict';

var addQueue = require('command_addQueue').addQueue;

function command(flag, parameters) {
    addQueue("spawnPriorityQueue", flag, parameters);
}

module.exports = {
    exec: command,
    command: "addPriorityQueue",
    help: 'Description:\n- Adds an ant to a spawnPriorityQueue\n\nUsage:\n- addPriorityQueue &lt;role&gt;',
};
