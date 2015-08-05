'use strict';

function reset() {

    Creep.prototype.do = function(action) {
        var routines = AI.extensions.routines[action];

        if (typeof routines !== "object" || typeof routines.routine !== "function") {
            throw Error("Cannot find routine " + action);
        }

        return routines.routine();
    };

    // It gets what it gets, otherwise it will digg to get it
    Room.prototype.get = function(type, options) {
        if (typeof AI.extensions.targets[type] === "object" &&
            typeof AI.extensions.targets[type].get === "function"
        ) return AI.extensions.targets[type].get(this, options);
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

    AI.get = function(type, options) {
        if (typeof AI.extensions.targets[type] === "object" &&
            typeof AI.extensions.targets[type].get === "function"
        ) return AI.extensions.targets[type].get(undefined, options);
    };
}

module.exports = {
    reset: reset
};

reset();