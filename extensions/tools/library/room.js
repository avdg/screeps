'use strict';

function hasWall(list, returnValueDefaultsTrue) {
    if (!Array.isArray(list)) {
        return returnValueDefaultsTrue === undefined ? true : returnValueDefaultsTrue;
    }

    for (var i = 0; i < list.length; i++) {
        if (list[i].type === "terrain" && (
            list[i].terrain === "wall" || list[i].terrain === "lava"
        )) {
            return true;
        }

        if (list[i].type === "structure") {
            switch(list[i].structureType) {
                case STRUCTURE_CONTROLLER:
                case STRUCTURE_EXTENSION:
                case STRUCTURE_KEEPER_LAIR:
                case STRUCTURE_LINK:
                case STRUCTURE_PORTAL:
                case STRUCTURE_WALL:
                    return true;

                case STRUCTURE_RAMPART:
                    if (list[i].my === false) {
                        return true;
                    }
                    break;

                case STRUCTURE_ROAD:
                    break;

                default:
                    throw Error('Unknown structure type ' + list[i].structureType);
            }
        }
    }

    return false;
}

/** Counts empty tiles around a certain positions
 *
 * For now, everything that isn't counted as a wall
 * as in terrain object is counted as free space.
 *
 * @param Number|Object x An object containing x, y and roomName or x position
 * @param Number|undefined y Y position if x is not an object
 * @param String|undefined room Room name if x is not an object
 *
 * @return Number The number of empty tiles
 */
function countEmptyTilesAround(x, y, room) {
    if (typeof x === "object" &&
        typeof x.x === "number" &&
        typeof x.y === "number" &&
        typeof x.roomName === "string"
    ) {
        room = x.roomName;
        y = x.y;
        x = x.x;
    }

    if (x < 0 || x > 49 || y < 0 || y > 49)
        return;

    var tiles = Game.rooms[room].lookAtArea(y - 1, x - 1, y + 1, x + 1);
    var spaces = 0;

    if (typeof tiles[y - 1] !== "object") tiles[y - 1] = {};
    if (typeof tiles[y + 1] !== "object") tiles[y + 1] = {};

    if (!hasWall(tiles[y - 1][x - 1])) spaces++;
    if (!hasWall(tiles[y - 1][x]))     spaces++;
    if (!hasWall(tiles[y - 1][x + 1])) spaces++;
    if (!hasWall(tiles[y][x - 1]))     spaces++;
    if (!hasWall(tiles[y][x + 1]))     spaces++;
    if (!hasWall(tiles[y + 1][x - 1])) spaces++;
    if (!hasWall(tiles[y + 1][x]))     spaces++;
    if (!hasWall(tiles[y + 1][x + 1])) spaces++;

    return spaces;
}

/**
 * Counts the number of roads, swamps and plain tiles on a given path
 *
 * @param path Array
 * @param room Object Reference to room object
 *
 * @return Object Formatted {plain: x, road: y, swamp: z}
 */
function examinePath(path, room) {
    var conclusion = {
        plain: 0,
        road: 0,
        swamp: 0
    };

    var tileData;
    var isSwamp;
    var isRoad;

    for (var i = 0; i < path.length; i++) {
        tileData = room.lookAt(path[i]);
        isSwamp = false;
        isRoad = false;

        for (var j = 0; j < tileData.length; j++) {
            if (tileData[j].type === "construction" && tileData[j].structure.type === "road") {
                isRoad = true; break;
            } else if (tileData[j].type === "terrain" && tileData[j].terrain === "swamp") {
                isSwamp = true;
            }
        }

        if (isSwamp) {
            conclusion.swamp++;
        } else if (isRoad) {
            conclusion.road++;
        } else {
            conclusion.plain++;
        }
    }

    return conclusion;
}

module.exports = {
    countEmptyTilesAround: countEmptyTilesAround,
    examinePath: examinePath,
    hasWall: hasWall
};