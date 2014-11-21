/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('debug'); // -> 'a thing'
 */

function printStatus() {
    if (Game.time % 100 !== 0) {
        return;
    }

    var msg = '';
    msg += "Number of spawn: " + Object.keys(Game.spawns).length + "\n";
    msg += "Number of creeps: " + Object.keys(Game.creeps).length + "\n";
    
    console.log(msg);
}
 
module.exports = function() {
   printStatus(); 
}
