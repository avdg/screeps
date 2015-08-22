'use strict';

var spawnEnergyCache = {};
var extensionsEnergyCache = {};

function reset() {

    Creep.prototype.do = function(action, options) {
        var routines = AI.extensions.routines[action];

        if (typeof routines !== "object" || typeof routines.routine !== "function") {
            throw Error("Cannot find routine " + action);
        }

        return routines.routine(this, options);
    };

    // It gets what it gets, otherwise it will digg to get it
    Room.prototype.get = function(type, options) {
        if (typeof AI.extensions.targets[type] === "object" &&
            typeof AI.extensions.targets[type].get === "function"
        ) return AI.extensions.targets[type].get(this, options);
    };

    Room.prototype.getExtensionEnergy = function() {
        var self = this;
        if (extensionsEnergyCache[this.name] === undefined) {
            extensionsEnergyCache[this.name] = 0;
            this.find(FIND_MY_STRUCTURES, {
                filter: function(obj) {
                    if (obj.structureType === STRUCTURE_EXTENSION) {
                        extensionsEnergyCache[self.name] += obj.energy;
                    }
                }
            });
        }

        return extensionsEnergyCache[this.name];
    };

    /** Counts empty tiles around a certain positions
     *
     * For now, everything that isn't counted as a wall
     * as in terrain object is counted as free space.
     *
     * @return Number The number of empty tiles
     */
    RoomPosition.prototype.countEmptyTilesAround = function() {
        if (this.x < 0 || this.x > 49 || this.y < 0 || this.y > 49)
            return;

        var tiles = Game.rooms[this.roomName].lookAtArea(
            this.y - 1, this.x - 1,
            this.y + 1, this.x + 1
        );
        var spaces = 0;

        if (typeof tiles[this.y - 1] !== "object") tiles[this.y - 1] = {};
        if (typeof tiles[this.y + 1] !== "object") tiles[this.y + 1] = {};

        if (!AI.hasWall(tiles[this.y - 1][this.x - 1])) spaces++;
        if (!AI.hasWall(tiles[this.y - 1][this.x    ])) spaces++;
        if (!AI.hasWall(tiles[this.y - 1][this.x + 1])) spaces++;
        if (!AI.hasWall(tiles[this.y    ][this.x - 1])) spaces++;
        if (!AI.hasWall(tiles[this.y    ][this.x + 1])) spaces++;
        if (!AI.hasWall(tiles[this.y + 1][this.x - 1])) spaces++;
        if (!AI.hasWall(tiles[this.y + 1][this.x    ])) spaces++;
        if (!AI.hasWall(tiles[this.y + 1][this.x + 1])) spaces++;

        return spaces;
    };

    Spawn.prototype.getAvailableEnergy = function() {
        if (spawnEnergyCache[this.name] === undefined) {
            spawnEnergyCache[this.name] = this.energy;
        }

        var extensionsEnergy = this.room.getExtensionEnergy();
        var energy = spawnEnergyCache[this.name] + extensionsEnergy;

        return energy;
    };

    Spawn.prototype.subtractEnergy = function(energy) {
        if (energy > this.getAvailableEnergy()) {
            return false;
        }

        // First subtract energy from spawn
        var leftOver = energy - spawnEnergyCache[this.name];

        // Check if spawn has more energy than we need
        if (leftOver < 0) {
            spawnEnergyCache[this.name] -= energy;
            return true;
        }

        // Subtract energy from spawns and extensions
        spawnEnergyCache[this.name] = 0;
        extensionsEnergyCache[this.room.name] -= leftOver;

        return true;
    };

    AI.get = function(type, options) {
        if (typeof AI.extensions.targets[type] === "object" &&
            typeof AI.extensions.targets[type].get === "function"
        ) return AI.extensions.targets[type].get(undefined, options);
    };
}

function resetState() {
    spawnEnergyCache = {};
    extensionsEnergyCache = {};
}

module.exports = {
    reset: reset, // Resets api
    test: {
        reset: resetState // Resets memory state
    }
};

reset();