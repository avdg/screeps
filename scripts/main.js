var timerStart = performance.now();

var settings = require('_settings');

var controller = require('stage_controller');
var debug = require('stage_debug');
var creeps = require('stage_creeps');
var spawners = require('stage_spawners');

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
