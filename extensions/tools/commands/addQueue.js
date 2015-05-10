'use strict';

function addQueue(queue, flag, parameters) {
    var roles = Game.extensions.roles;

    if (parameters.length < 2) {
        console.log('Flag command addQueue: addQueue command has not enough parameters');
        flag.remove();
        return;
    }

    if (!(parameters[1] in roles)) {
        console.log('Flag command addQueue: can not find role ' + parameters[1]);
        flag.remove();
        return;
    }

    if (undefined === Memory[queue] && parameters[1] in roles) {
        Memory[queue] = [parameters[1]];
    } else {
        Memory[queue][Memory[queue].length] = parameters[1];
    }

    console.log('Flag command addQueue: added ' + parameters[1] + " to " + queue);
    flag.remove();
}

function command(flag, parameters) {
    addQueue("spawnQueue", flag, parameters);
}

module.exports = {
    exec: command,
    command: "addQueue",
    help: 'Description:\n- Adds an ant to a spawnQueue\n\nUsage:\n- addQueue &lt;role&gt;',
    addQueue: addQueue,
};
