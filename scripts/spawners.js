/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('spawners'); // -> 'a thing'
 */
var generics = require('_generics');
var roles = require('roles');

function creepNameGenerator(prefix) {
    var name;
    do {
        name = prefix + ' ' + generics.generator();
    } while (name in Game.creeps);

    return name;
}

/*
 * Error codes:
 * -1: Creep not found
 * -2: Not enough energy to spawn creep
 */
function createCreep(spawn, role) {
    if (role in roles) {
        var body = roles[role].build();

        if (generics.getCreepCost(body) > spawn.energy) {
            return -2;
        }

        var name = creepNameGenerator(role);
        console.log('Creating ' + role + ' ' + name);

        var result = spawn.createCreep(body, name, {role:role});

        if (result !== name) {
            console.log('Spawn error: ' + result);
        }
    } else {
        return -1
    }
}

function spawner(spawn) {
    var result;
    var i;

    // First be spawn specific
    if (Memory.spawns[spawn.name]) {

        // If there is any creep in the priority queue, spawn or abord
        if (Memory.spawns[spawn.name].spawnPriorityQueue && Memory.spawns[spawn.name].spawnPriorityQueue.length > 0) {
            if (generics.getCreepCost(roles[Memory.spawns[spawn.name].spawnPriorityQueue[0]].build()) <= spawn.energy) {
                result = createCreep(spawn, Memory.spawns[spawn.name].spawnPriorityQueue[0]);

                if (result == undefined) {
                    Memory.spawns[spawn.name].spawnPriorityQueue.splice(0, 1);
                }
            }

            return;
        }

        // Find first creep possible to be created
        if (Memory.spawns[spawn.name].spawnQueue) {
            for (i = 0; i < Memory.spawns[spawn.name].spawnQueue.length; i++) {
                if (generics.getCreepCost(roles[Memory.spawns[spawn.name].spawnQueue[i]].build()) <= spawn.energy) {
                    result = createCreep(spawn, Memory.spawns[spawn.name].spawnQueue[i]);

                    if (result == undefined) {
                        Memory.spawns[spawn.name].spawnQueue.splice(i, 1);
                        return;
                    }
                }
            }
        }
    }

    // If there is any creep in the priority queue, spawn or abord
    if (Memory.spawnPriorityQueue.length > 0) {
        if (generics.getCreepCost(roles[Memory.spawnPriorityQueue[0]].build()) <= spawn.energy) {
            result = createCreep(spawn, Memory.spawnPriorityQueue[0]);

            if (result == undefined) {
                Memory.spawnPriorityQueue.splice(0, 1);
            }
        }

        return;
    }

    // Find first creep possible to be created
    for (i = 0; i < Memory.spawnQueue.length; i++) {
        if (generics.getCreepCost(roles[Memory.spawnQueue[i]].build()) <= spawn.energy) {
            result = createCreep(spawn, Memory.spawnQueue[i]);

            if (result == undefined) {
                Memory.spawnQueue.splice(i, 1);
                return;
            }
        }
    }

    // TODO Insert here what to spawn on default if wanted
    // createCreep(spawn, 'FOO');
}

module.exports = function(spawn) {

    var name;
    for (name in Game.spawns) {
        var spawn = Game.spawns[name];

        if (spawn.spawning == undefined) {
            spawner(spawn);
        }
    }
}
