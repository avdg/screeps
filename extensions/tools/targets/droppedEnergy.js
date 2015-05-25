'use strict';

var all;
var cache = {};

function getCache(room) {
    if (room === undefined) {
        if (all === undefined) {
            all = [];
            for (var i in Game.rooms) {
                all = all.concat(getCache(i));
            }
        }

        return all;
    }

    if (room instanceof Room) {
        room = room.name;
    }

    if (cache[room] === undefined) {
        cache[room] = Game.rooms[room].find(FIND_DROPPED_ENERGY);
    }

    return cache[room];
}

function get(room, options) {
    if (options === undefined) {
        options = {};
    }

    return getCache(room);
}

function find(options) {
    if (options === undefined) {
        options = {};
    }

    return {
        filter: function(obj) {
            if (obj instanceof Energy) {
                return true;
            }

            return false;
        }
    };
}

module.exports = {
    get: get,
    find: find
};