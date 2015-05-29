'use strict';

var roles = AI.extensions.roles;

module.exports = function() {
    var i, length, role, creeps = AI.get('myCreeps');
    var timer, timers = {};

    for (i = 0, length = creeps.length; i < length; i++) {
        var creep = creeps[i];

        if (typeof creep.memory.role !== "string") {
            console.log('Warning: Creep without role');
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
