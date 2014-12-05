/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('creeps'); // -> 'a thing'
 */
var roles = require('roles');

module.exports = function() {
    var name;
    for(name in Game.creeps) {
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
}
