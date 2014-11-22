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
        var body = roles[role].spawn();

        if (generics.getCreepCost(body) > spawn.energy) {
            return -2;
        }

        var name = creepNameGenerator(role);
        console.log('Creating ' + role + ' ' + name);

        spawn.createCreep(body, name, {role:role});
    } else {
        return -1
    }
}

function spawner(spawn) {
    // Find first creep possible to be created
    if (Memory.spawnQueue && Memory.spawnQueue.length > 0) {
        var i = 0;
        while (
            i < Memory.spawnQueue.length &&
            generics.getCreepCost(roles[Memory.spawnQueue[i]].spawn()) > spawn.energy
        ) {
            i++;
        }

        if (
            i < Memory.spawnQueue.length &&
            generics.getCreepCost(roles[Memory.spawnQueue[i]].spawn()) <= spawn.energy
        ) {
            var result = createCreep(spawn, Memory.spawnQueue[i]);
            
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
    
        if (!spawn.my) {
            continue;
        }
    
        if (spawn.spawning == undefined) {
            spawner(spawn);
        }
    }
}
