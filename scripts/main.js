var timerStart = performance.now();

try {
    var settings = require('_settings');

    var controller = require('stage_controller');
    var debug = require('stage_debug');
    var creeps = require('stage_creeps');
    var spawners = require('stage_spawners');

    controller.pre();
    creeps();
    spawners();
    controller.post();
} catch (e) {
    console.log('Caught exception:');
    if (typeof e === "object") {
        if (e.stack) {
            if (e.name && e.message) {
                console.log(e.name + ': ' + e.message);
            }
            console.log(e.stack);
        } else {
            console.log(e, JSON.stringify(e));
        }
    } else {
        console.log(e);
    }
}

var timerEnd = performance.now();
var timerDiff = timerEnd - timerStart;

if (timerDiff > settings.roundTimeLimit) {
    console.log('Warning: Round ' + Game.time + ' took ' + timerDiff + ' ms to complete');
}
