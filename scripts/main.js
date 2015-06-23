'use strict';

var timerStart = Game.getUsedCpu();
const whitespaces = "                                                                                                    ";

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
    message += "🚀 Round " + Game.time + "\n";
    message += AI.getTimeDiff(0, timerEnd) + " ms used";
    message += Game.cpuLimit === Infinity ? "\n" : " (" + Math.round(timerEnd / Game.cpuLimit * 100) + "% of " + Game.cpuLimit + " ms available)\n";

    var stageMessages = [
        "Main timers:",
        "Start           " + AI.getTimeDiff(0, timerStart) + " ms",
        "Requiring       " + AI.getTimeDiff(timerStart, timerRequire) + " ms",
        "Setup           " + AI.getTimeDiff(timerRequire, timerSetup) + " ms",
        "Pre controller  " + AI.getTimeDiff(timerSetup, timerPreController) + " ms",
        "Creeps          " + AI.getTimeDiff(timerPreController, timerCreeps) + " ms",
        "Spawners        " + AI.getTimeDiff(timerCreeps, timerSpawners) + " ms",
        "Post controller " + AI.getTimeDiff(timerSpawners, timerEnd) + " ms"
    ];

    // Calculate lengths
    var tmpFunc = function(a, b) { return Math.max(a, b.length); };
    var stageMessagesLength = [0].concat(stageMessages).reduce(tmpFunc);
    var roleMessageLength = [0].concat(Object.keys(creepTimers)).reduce(tmpFunc);

    // Default message for stage
    var stageMessageEmpty = whitespaces.substr(0, stageMessagesLength);

    // Prepare messages for roles
    var creepMessages = Object.keys(creepTimers).length > 0 ? ["Creep timers:"] : [];
    var time;
    var tmp;
    for (var i in creepTimers) {
        time = AI.getTimeDiff(0, creepTimers[i].totalTime);
        tmp = i + stageMessageEmpty.substr(0, roleMessageLength - i.length) + " " + time + " ms   ";
        for (var creep in creepTimers[i].timers) {
            tmp += " - " + creep + " " + creepTimers[i].timers[creep] + " ms";
        }
        creepMessages.push(tmp);
    }

    // Assemble the message
    for (var j = 0, k = Math.max(stageMessages.length, creepMessages.length); j < k; j++) {
        tmp = (stageMessages[j] || stageMessageEmpty);
        message += tmp + whitespaces.substr(0, stageMessageEmpty.length - tmp.length);
        message += "   " + (creepMessages[j] || "") + "\n";
    }

    message += "Time to print debug message: " + AI.getTimeDiff(timerEnd, Game.getUsedCpu()) + " ms";

    console.log(message);
}