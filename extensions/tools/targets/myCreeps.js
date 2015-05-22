'use strict';

var all = false;
var cache = {};

function getCache(room) {
    if (all === false) {
        all = [];
        for (var i in Game.creeps) {
            if (!Game.creeps.spawning) {
                if (cache[Game.creeps[i].room] === undefined) {
                    cache[Game.creeps[i].room] = [Game.creeps[i]];
                } else {
                    cache[Game.creeps[i].room].push(Game.creeps[i]);
                }
            }
            all.push(Game.creeps[i]);
        }
    }

    if (room === undefined) {
        return all;
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