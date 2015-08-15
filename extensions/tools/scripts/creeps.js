'use strict';

module.exports = function() {
    var roles = AI.extensions.roles;
    var i, length, role;
    var timer, timers = {};

    for (i in Game.creeps) {
        var creep = Game.creeps[i];

        if (typeof creep.memory.role !== "string") {
            console.log('Warning: Creep without role at ' + creep.pos.x + "," + creep.pos.y);
            creep.memory.role = creep.name.split(' ')[0];
            continue;
        }

        if (creep.spawning === true) {
            if (typeof roles[creep.memory.role].spawning === "function") {
                roles[creep.memory.role].spawning(creep);
            }

            continue;
        }

        // Bench function
        timer = Game.getUsedCpu();
        roles[creep.memory.role].turn(creep);
        timer = AI.getTimeDiff(timer, Game.getUsedCpu());

        // Keep records of all times
        if (timers[creep.memory.role] === undefined) {
            timers[creep.memory.role] = {
                totalTime: timer,
                timers: {}
            };
        } else {
            timers[creep.memory.role].totalTime += timer;
        }

        timers[creep.memory.role].timers[creep.name] = timer;
    }

    for (role in roles) {
        if (typeof roles[role].endTurn === "function") {
            roles[role].endTurn();
        }
    }

    return timers;
};
