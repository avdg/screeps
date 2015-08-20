'use strict';

module.exports = function() {
    var roles = AI.extensions.roles;
    var i, length, role;
    var timer, timers = {};

    for (i in Game.creeps) {
        var creep = Game.creeps[i];

        if (typeof creep.memory.role !== "string" || roles[creep.memory.role] === undefined) {
            // Trigger hook and hope we get a result;
            var results = AI.emit("noRole");

            // Check results
            for (var j = 0; j < results.length; j++) {
                if (typeof results[j] === "string") {
                    if (role === undefined) {
                        role = results[j];
                    } else {
                        role = null;
                    }
                }
            }

            // Make sure all hooks agree on a single solution, undefined means the vote is withheld
            if (typeof role !== "string") {
                if (role === undefined) {
                    console.log("Warning: Creep " + creep.name + " without role at " + creep.pos.x + "," + creep.pos.y + " in room " + creep.pos.roomName);
                } else if (role === null) {
                    console.log("Warning: Creep " + creep.name + " has been assigned with multiple roles");
                }
                continue;
            }
        } else {
            role = creep.memory.role;
        }

        if (creep.spawning === true) {
            if (typeof roles[role].spawning === "function") {
                roles[role].spawning(creep);
            }

            continue;
        }

        // Bench function
        timer = Game.getUsedCpu();
        roles[role].turn(creep);
        timer = AI.getTimeDiff(timer, Game.getUsedCpu());

        // Keep records of all times
        if (timers[role] === undefined) {
            timers[role] = {
                totalTime: timer,
                timers: {}
            };
        } else {
            timers[role].totalTime += timer;
        }

        timers[role].timers[creep.name] = timer;
    }

    for (role in roles) {
        if (typeof roles[role].endTurn === "function") {
            roles[role].endTurn();
        }
    }

    return timers;
};
