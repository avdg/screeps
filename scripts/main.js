var timerStart = new Date().getTime();

var settings = require('_settings');

var controller = require('stage_controller');
var creeps = require('stage_creeps');
var spawners = require('stage_spawners');

controller.pre();
creeps();
spawners();
controller.post();

var timerEnd = new Date().getTime();
var timerDiff = Math.round(timerEnd - timerStart);

if (timerDiff > settings.roundTimeLimit) {
    console.log('Warning: Round ' + Game.time + ' took ' + timerDiff + ' ms to complete');
}
