/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports = 'a thing';
 *
 * You can import it in main and use it as follow:
 * var debug = require('debug');
 *
 * debug();
 */
 var steps = 100;

function printStatus() {
    if (Game.time % steps !== 0) {
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
