'use strict';

var firstTurnCache;
var isFirstTurn = function() {
    // Check for cache hits
    if (firstTurnCache !== undefined)
        return firstTurnCache;

    // Make sure memory is set
    if (Memory.permanent === undefined)
        Memory.permanent = { restarts : [] }; // Log restarts for debugging

    // Get spawns to compare later
    var oldSpawnIds = Memory.permanent.spawnIds;
    Memory.permanent.spawnIds = Object.keys(Game.spawns).map(
        function(s) {
            return Game.spawns[s].id;
        }
    ).sort();

    // In case the old value isn't an array
    if (!Array.isArray(oldSpawnIds)) {
        Memory.permanent.firstTurn = Game.time;
        Memory.permanent.restarts.push({start: Game.time, spawns: Memory.permanent.spawnIds});
        return (firstTurnCache = true);
    }

    // Check for spawn matches
    var hasSpawnId = false;
    for (var i = oldSpawnIds.length; i >= 0; i--) {
        if (Memory.permanent.spawnIds.indexOf(oldSpawnIds[i]) > -1) {
            hasSpawnId = true;
        }
    }

    // Not the first turn if at least one spawn matches
    if (hasSpawnId) {
        return (firstTurnCache = false);
    }

    // We seem to be reset, we have to start from scratch!

    // False positive check to avoid memory being filled with restarts
    if ((Game.time - Memory.permanent.firstTurn) < 10) {
        if (Memory.permanent.multipleRestartsSince === undefined) {
            Memory.permanent.multipleRestartsSince = Game.time;
        }

        Memory.permanent.firstTurn = Game.time;
        return (firstTurnCache = true);
    }

    var data = {start: Game.time, spawns: Memory.permanent.spawnIds};
    if (Memory.permanent.multipleRestartsSince !== undefined) {
        data.multipleRestartsSince = Memory.permanent.multipleRestartsSince;
    }

    Memory.permanent.firstTurn = Game.time;
    Memory.permanent.restarts.push(data);
    Memory.permanent.multipleRestartsSince = undefined;
    return (firstTurnCache = true);
};

module.exports = {
    isFirstTurn: isFirstTurn,

    test: {
        set firstTurnCache (value) { firstTurnCache = value; },
        get firstTurnCache () { return firstTurnCache; }
    }
};