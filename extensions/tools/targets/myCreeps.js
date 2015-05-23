'use strict';

var all = false;
var cache = {};
var spawning = [];

// Note: contains spawning creeps
function getCache(room) {
    if (all === false) {
        all = [];
        for (var i in Game.creeps) {
            if (cache[Game.creeps[i].room.name] === undefined) {
                cache[Game.creeps[i].room.name] = [Game.creeps[i]];
            } else {
                cache[Game.creeps[i].room.name].push(Game.creeps[i]);
            }

            if (Game.creeps[i].spawning) {
                spawning.push(Game.creeps[i]);
            }

            all.push(Game.creeps[i]);
        }
    }

    if (room === undefined) {
        return all;
    }

    if (room instanceof Room) {
        room = room.name;
    }

    if (cache[room] === undefined) {
        return [];
    }

    return cache[room];
}

function get(room, options) {
    if (options === undefined) {
        options = {};
    }

    return getCache(room);
}

function filter(creep, options) {
    options = options || {};

    return {
        filter: function(obj) {
            if (!(obj instanceof Creep)) {
                return false;
            }

            if (obj.my !== true) {
                return false;
            }

            if (options.spawningOnly === true) {
                return creep.spawning === true;
            }

            if (options.spawning !== true) {
                return creep.spawning === false;
            }

            return true;
        }
    };
}

module.exports = {
    get: get,
    filter: filter
};