'use strict';

var all = false;
var cache = {};

function getCache(room) {
    if (all === false) {
        all = [];
        for (var i in Game.structures) {
            if (cache[Game.structures[i].room.name] === undefined) {
                cache[Game.structures[i].room.name] = [Game.structures[i]];
            } else {
                cache[Game.structures[i].room.name].push(Game.structures[i]);
            }
            all.push(Game.structures[i]);
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

function filter(structure, options) {
    options = options || {};

    return {
        filter: function(obj) {
            if (!(obj instanceof Structure)) {
                return false;
            }

            if (obj.my !== true) {
                return false;
            }

            return true;
        }
    };
}

module.exports = {
    get: get,
    filter: filter
};