'use strict';

var _ = require('lodash');

var duplicateCreep = function (creep, priority) {
    var spawn;

    priority = priority === true ? 'spawnPriorityQueue' : 'spawnQueue';

    // Find and add to queue
    if (creep.memory.spawn) {
        spawn = Game.getObjectById(creep.memory.spawn).name;
    }

    if ((typeof spawn) !== 'string' && creep.pos) {
        spawn = creep.pos.findClosest(FIND_MY_SPAWNS).name;
    } else {
        Memory[priority].push({
            role: creep.role, memory: _.cloneDeep(creep.memory)
        });
        return;
    }

    if (!Memory.spawns[spawn]) Memory.spawns[spawn] = {};
    if (!Memory.spawns[spawn][priority]) Memory.spawns[spawn][priority] = [];

    Memory.spawns[spawn][priority].push({
        role: creep.role, memory: _.cloneDeep(creep.memory)
    });
};

var command = function(flag, parameters) {
    if (parameters.length < 2) {
        console.log('Flag command creepClone: creepClone command has not enough parameters');
        flag.remove();
        return;
    }

    if (typeof Game.creeps[parameters[1]] !== 'object') {
        console.log('Flag command creepClone: Creep ' + parameters[1] + ' not found');
        flag.remove();
        return;
    }

    var priority = false;
    if (parameters.length > 2 && parameters[2].toLowerCase() === 'true') {
        priority = true;
    }

    duplicateCreep(Game.creeps[parameters[1]], priority);
    flag.remove();
};

var native = function(command, creep, priority) {
    return duplicateCreep(creep, priority);
};

module.exports = {
    exec: command,
    command: "creepClone",
    native: native,
    help: 'Description:\n- Duplicates a creep\n\nUsage:\n- creepClone &lt;creepName&gt; [priority=false]',
};
