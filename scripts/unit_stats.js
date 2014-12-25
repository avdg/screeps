var settings = require('_settings');

var updateStats = function() {
    var addStatWithMax = function(entry, n) {
        Memory.stats[entry] = n;
        Memory.stats[entry + 'Max'] = previous === undefined ?
            n : Math.max(previous[entry + 'Max'], n);
    };

    var previous;
    if (Memory.stats) {
        Memory.statsHistory[Memory.stats.time] = Memory.stats;
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
