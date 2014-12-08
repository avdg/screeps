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
        console.log('Spawner: Creating ' + role + ' ' + name);

        var result = spawn.createCreep(body, name, {role:role});

        if (result !== name) {
            console.log('Spawner: Spawn error: ' + result);
        }
    } else {
        return -1;
    }
}

/**
 * Attempts to spawn a creep from spawner
 *
 * Non-priority mode: spawns first possible creep
 * Priority mode: spawns first or fails
 *
 * @param spawn spawn
 * @param array queue
 * @param bool  priority
 *
 * Returns undefined when queue is empty
 * Returns true when a creep could be spawned
 * Returns false when no creep could be spawned
 */
function spawnAttempt(spawn, queue, priority) {
    if (!queue) return;

    for (var max = priority ? 1 : queue.length, i = 0, result; i < max; i++) {
        result = createCreep(spawn, queue[i]);

        if (result == undefined) {
            queue.splice(0, 1);
            return true;
        }
    }

    if (i === queue.length || (i > 0 && priority)) {
        return false;
    }
}

function spawner(spawn) {
    // Note: when priorityQueue has items and can't spawn, spawning ends immediately

    // Spawn specific
    if (Memory.spawns[spawn.name]) {
        if (spawnAttempt(spawn, Memory.spawns[spawn.name].spawnPriorityQueue, true) !== undefined) return;
        if (spawnAttempt(spawn, Memory.spawns[spawn.name].spawnQueue, false)) return;
    }

    // Global
    if (spawnAttempt(spawn, Memory.spawnPriorityQueue, true) !== undefined) return;
    if (spawnAttempt(spawn, Memory.spawnQueue, false)) return;

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
