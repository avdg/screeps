var timerStart = performance.now();

var debug = require('debug');
var controller = require('controller');
var creeps = require('creeps');
var spawners = require('spawners');
var settings = require('_settings');

debug();
controller.pre();
creeps();
spawners();
controller.post();

var timerEnd = performance.now();
var timerDiff = timerEnd - timerStart;

if (timerDiff > settings.roundTimeLimit) {
    console.log('Warning: Round ' + Game.time + ' took ' + timerDiff + ' ms to complete');
}
