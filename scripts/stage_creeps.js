'use strict';

var roles = Game.extensions.roles;

module.exports = function() {
    var name, role;
    for (name in Game.creeps) {
        var creep = Game.creeps[name];

        if (!creep.my) {
            continue;
        }

        if ("role" in creep.memory) {
            roles[creep.memory.role].turn(creep);
        } else {
            console.log('Warning: Ant without role');
        }
    }

    for (role in roles) {
        if (roles[role].endTurn) {
            roles[role].endTurn();
        }
    }
};
