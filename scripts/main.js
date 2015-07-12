'use strict';

var timerStart = Game.getUsedCpu();

var setup = require('stage_setup');
var creeps = require('stage_creeps');
var spawners = require('stage_spawners');

var timerRequire = Game.getUsedCpu();

setup();
var timerSetup = Game.getUsedCpu();

if (AI.isFirstTurn()) {
    AI.emit("firstTurn");
}

AI.emit("preController");
var timerPreController = Game.getUsedCpu();

var creepTimers = creeps();
var timerCreeps = Game.getUsedCpu();

spawners();
var timerSpawners = Game.getUsedCpu();

AI.emit("postController");
var timerEnd = Game.getUsedCpu();

if (typeof global.run === "function") {
    global.run();
    global.run = undefined;
}

if (timerEnd > AI.settings.roundTimeLimit) {
    var message = '';
    message += "🚀 Round " + Game.time + " * ";
    message += AI.getTimeDiff(0, timerEnd) + " ms used";

    if (Number.isFinite(Game.cpuLimit))
        message += " (" + Math.round(timerEnd / Game.cpuLimit * 100) + "% of " + Game.cpuLimit + " ms available)";

    message += "\n";

    // Set up table data
    var stageMessages = [
        "Main timers",
        "Start",
        "Requiring",
        "Setup",
        "Pre controller",
        "Creeps",
        "Spawners",
        "Post controller"
    ];

    var stageTimers = [
        "⌛",
        AI.getTimeDiff(0,                  timerStart        ).toFixed(2) + " ms",
        AI.getTimeDiff(timerStart,         timerRequire      ).toFixed(2) + " ms",
        AI.getTimeDiff(timerRequire,       timerSetup        ).toFixed(2) + " ms",
        AI.getTimeDiff(timerSetup,         timerPreController).toFixed(2) + " ms",
        AI.getTimeDiff(timerPreController, timerCreeps       ).toFixed(2) + " ms",
        AI.getTimeDiff(timerCreeps,        timerSpawners     ).toFixed(2) + " ms",
        AI.getTimeDiff(timerSpawners,      timerEnd          ).toFixed(2) + " ms"
    ];

    var creepRoleMessages = Object.keys(creepTimers).length > 0 ? ["Creep timers"] : [];
    var creepRoleTime     = Object.keys(creepTimers).length > 0 ? ["⌛"] : [];
    var creepTimeMessages = Object.keys(creepTimers).length > 0 ? [""] : [];
    var tmp;

    for (var i in creepTimers) {
        creepRoleMessages.push(i);
        creepRoleTime.push(AI.getTimeDiff(0, creepTimers[i].totalTime).toFixed(2) + " ms");

        // Format: <number of creeps> - <creepTimer1> - <creepTimer2> - etc...
        tmp = Object.keys(creepTimers[i].timers).length;
        for (var creep in creepTimers[i].timers) {
            tmp += " - " + creep + " " + creepTimers[i].timers[creep].toFixed(2) + " ms ";
        }
        creepTimeMessages.push(tmp);
    }

    var displayData = [
        stageTimers,
        stageMessages,
        creepRoleTime,
        creepRoleMessages,
        creepTimeMessages
    ];

    message += AI.alignColumns(displayData, {glue: " ", align: ["right", "left", "right", "left", "left"]});
    message += "Time to print debug message: " + AI.getTimeDiff(timerEnd, Game.getUsedCpu()).toFixed(2) + " ms";

    console.log(message);
}