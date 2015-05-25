'use strict';

var all = false;
var cache = {};

function getCache(room) {
    if (all === false) {
        all = [];
        for (var i = 0, data = [Game.structures, Game.spawns]; i < data.length; i++) {
            for (var j in data[i]) {
                if (cache[data[i][j].room.name] === undefined) {
                    cache[data[i][j].room.name] = [data[i][j]];
                } else {
                    cache[data[i][j].room.name].push(data[i][j]);
                }
                all.push(data[i][j]);
            }
        }
    }

    if (room === undefined) {
        return all;
    }

    if (room instanceof Room) {
        room = room.roomName;
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

function find(structure, options) {
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
    find: find
};