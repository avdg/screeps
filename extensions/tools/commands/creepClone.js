'use strict';

var duplicateCreep = function (creep, priority, silence) {
    var spawn;

    priority = priority === true ? 'spawnPriorityQueue' : 'spawnQueue';
    silence = silence === true;

    // Find and add to queue
    if (typeof creep.memory.spawn === "string") {
        spawn = Game.getObjectById(creep.memory.spawn).name;
    }

    if (typeof spawn !== 'string') {
        Memory[priority].push({
            role: creep.memory.role, memory: _.cloneDeep(creep.memory)
        });

        if (!silence) {
            console.log("Added " + creep.name + " to global " + priority);
        }

        return;
    }

    if (!Memory.spawns[spawn]) Memory.spawns[spawn] = {};
    if (!Memory.spawns[spawn][priority]) Memory.spawns[spawn][priority] = [];

    Memory.spawns[spawn][priority].push({
        role: creep.memory.role, memory: _.cloneDeep(creep.memory)
    });

    if (!silence) {
        console.log("Added " + creep.name + " to " + priority + " at spawn " + spawn);
    }
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

var native = function(command, creep, priority, silence) {
    return duplicateCreep(creep, priority, silence);
};

module.exports = {
    exec: command,
    command: "creepClone",
    native: native,
    help: 'Description:\n- Duplicates a creep\n\nUsage:\n- creepClone &lt;creepName&gt; [priority=false]',
};
