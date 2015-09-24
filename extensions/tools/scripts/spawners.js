'use strict';

function creepNameGenerator(prefix) {
    var name;
    do {
        name = prefix + ' ' + AI.generator();
    } while (name in Game.creeps);

    return name;
}

function createCreep(spawn, creep) {
    var memory = {};
    var roles = AI.extensions.roles;

    if (typeof creep === "string") {
        memory.role = creep;

    } else if (typeof creep === "object") {
        if (!creep.role) return ERR_INVALID_ARGS;
        if (creep.memory && typeof creep.memory === "object")
            memory = _.cloneDeep(creep.memory);
        memory.role = creep.role;

    } else {
        return ERR_INVALID_ARGS;
    }

    if (!(memory.role in roles)) {
        return ERR_INVALID_ARGS;
    }

    var body = roles[memory.role].build(spawn, memory);
    var name = creepNameGenerator(memory.role);

    var result = spawn.canCreateCreep(body, name, memory);

    if (result === OK) {
        result = spawn.createCreep(body, name, memory);
        console.log('Spawner: Creating ' + name + " : " + JSON.stringify(body));

        if (typeof result !== "string") {
            console.log("Unexpected error " + result + ": cannot spawn " + name + " with role " + memory.role);
        }
    }

    return result;
}

function newSpawn(spawn) {
    Memory.spawns[spawn.name] = {};
    Memory.spawns[spawn.name].spawnPriorityQueue = [];
    Memory.spawns[spawn.name].spawnQueue = [];
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
    if (queue === undefined || queue.length < 1) return;

    // Only go 1 deep if priority matters
    var max = priority ? 1 : queue.length;

    for (var i = 0, result; i < max; i++) {
        result = createCreep(spawn, queue[i]);

        if (typeof result === "string") {
            queue.splice(i, 1);
            return true;
        }

        switch (result) {
            case ERR_INVALID_ARGS:
                console.log('Spawner: Cannot find creep type with parameter ' +
                    JSON.stringify(queue[i])
                );
                break;

            case ERR_NOT_ENOUGH_ENERGY:
                break; // Be patient, we just don't have the energy to do great things yet

            default:
                console.log('Spawner: Unknown error ' + result + ' for creep ' +
                    JSON.stringify(queue[i])
                );
        }
    }

    if (i === queue.length || (queue.length > 0 && priority)) {
        return false;
    }
}

function spawner(spawn) {
    // Note: when priorityQueue has items and can't spawn, spawning ends immediately

    // Spawn specific
    if (Memory.spawns[spawn.name]) {
        if (spawnAttempt(spawn, Memory.spawns[spawn.name].spawnPriorityQueue, true) !== undefined) return;
        if (spawnAttempt(spawn, Memory.spawns[spawn.name].spawnQueue, false)) return;

    } else {
        newSpawn(spawn);
    }

    // Room specific
    if (Memory.rooms[spawn.room.name]) {
        if (spawnAttempt(spawn, Memory.rooms[spawn.room.name].spawnPriorityQueue, true) !== undefined) return;
        if (spawnAttempt(spawn, Memory.rooms[spawn.room.name].spawnQueue, false)) return;
    }

    // Global
    if (spawnAttempt(spawn, Memory.spawnPriorityQueue, true) !== undefined) return;
    if (spawnAttempt(spawn, Memory.spawnQueue, false)) return;

    // Nothing to spawn - notify hooks
    AI.emit("noSpawn", spawn, function(creep) { return createCreep(spawn, creep); });
}

module.exports = function() {

    var spawn;
    for (var name in Game.spawns) {
        spawn = Game.spawns[name];

        if (!spawn.spawning) {
            spawner(spawn);
        }
    }
};
