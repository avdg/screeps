var settings = require('_settings');

var storeStats = function(time, stats) {

    var keys = Object.keys(Memory.statsHistory), i, value, tmp;
    for (i in Memory.statsHistory) {
        value = i in stats ? stats[i] : NaN;

        // Grab previous value
        tmp = Memory.statsHistory[i][Memory.statsHistory[i].length - 1];

        // Value is same
        if (tmp.type === undefined && tmp.value === value && tmp.last === (time - 1)) {
            tmp.last = time;

        // Value is counting up
        } else if (tmp.last === (time - 1) && tmp.value === (value - 1) &&
            (tmp.type === "countUp" || tmp.start === tmp.last)
        ) {
            if (tmp.start === tmp.last) {
                tmp.type = "countUp";
                tmp.startValue = tmp.value;
            }

            tmp.last = time;
            tmp.value = value;

        // Default case
        } else {
            Memory.statsHistory[i].push({start: time, last: time, value: stats[i]});
        }
    }

    // Check for new statistics
    for (i in stats) {
        if (!(i in Memory.statsHistory)) {
            Memory.statsHistory[i] = [{start: time, last: time, value: stats[i]}];
        }
    }
};

var updateStats = function() {
    var addStatWithMax = function(entry, n) {
        Memory.stats[entry] = n;
        Memory.stats[entry + 'Max'] = previous === undefined ?
            n : Math.max(previous[entry + 'Max'], n);
    };

    var previous;
    if (Memory.stats) {
        storeStats(Memory.stats.time, Memory.stats);
        previous = Memory.stats;

    } else {
        Memory.statsHistory = {};
        Memory.statsDescription = {
            'time':                  'Time when taking stats',

            // Creeps
            'myCreeps':               'Current number of owning creeps',
            'myCreepsMax':            'Maximum number of owning creeps',

            // Queue
            'globalQueue':            'Current number of creeps in global spawn queue',
            'globalQueueMax':         'Maximum number of creeps in global spawn queue',
            'globalPriorityQueue':    'Current number of creeps in global priority spawn queue',
            'globalPriorityQueueMax': 'Maximum number of creeps in global priority spawn queue',

            // Spawns
            'mySpawns':               'Current number of owning spawns',
            'mySpawnsMax':            'Maximum number of owning spawns',

            // Flags
            'myFlags':                'Current number of owning flags',
            'myFlagsMax':             'Maximum number of owning flags',
        };
    }

    Memory.stats = {
        'time': Game.time,
    };

    // Creeps
    addStatWithMax('myCreeps', Object.keys(Game.creeps).length);

    // Global queues
    addStatWithMax('globalQueue', Memory.spawnQueue.length);
    addStatWithMax('globalPriorityQueue', Memory.spawnPriorityQueue.length);

    // Spawns
    addStatWithMax('mySpawns', Object.keys(Game.spawns).length);

    // Flags
    addStatWithMax('myFlags', Object.keys(Game.flags).length);
};

var printStatus = function() {
   if (Game.time % settings.statusFrequency !== 0) {
       return;
   }

   var msg = '';
   msg += "***** Round " + Game.time + " *****" + "\n\n";
   msg += "Number of creeps in global queue: " + Memory.stats.globalQueue + "\n";
   msg += "Number of creeps in global priorityQueue: " + Memory.stats.globalPriorityQueue + "\n";
   msg += "Number of own spawn: " + Memory.stats.mySpawns + "\n";
   msg += "Number of own creeps: " + Memory.stats.myCreeps + "\n";
   msg += "Number of flags: " + Memory.stats.myFlags + "\n";

   console.log(msg);
};

function preController() {
    updateStats();
    printStatus();
}

function postController() {

}

module.exports = {
    preController: preController,
    postController: postController
};
