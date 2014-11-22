var timerStart = performance.now();

var debug = require('debug');
var controller = require('controller');
var creeps = require('creeps');
var spawners = require('spawners');

debug();
controller();
creeps();
spawners();

var timerEnd = performance.now();
var timerDiff = timerEnd - timerStart;

if (timerDiff > 50) {
    console.log('Round ' + Game.time + ' took ' + timerDiff + ' ms to complete');
}
