'use strict';

var roles = AI.extensions.roles;

module.exports = function() {
    var i, length, role, creeps = AI.get('myCreeps');

    for (i = 0, length = creeps.length; i < length; i++) {
        var creep = creeps[i];

        if (typeof creep.memory.role === "string") {
            if (creep.spawning === true) {
                if (typeof roles[creep.memory.role].spawning === "function") {
                    roles[creep.memory.role].spawning(creep);
                }
            } else {
                roles[creep.memory.role].turn(creep);
            }
        } else {
            console.log('Warning: Ant without role');
        }
    }

    for (role in roles) {
        if (typeof roles[role].endTurn === "function") {
            roles[role].endTurn();
        }
    }
};
