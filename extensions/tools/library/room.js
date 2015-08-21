'use strict';

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
            switch(list[i].structure.structureType) {
                case STRUCTURE_CONTROLLER:
                case STRUCTURE_EXTENSION:
                case STRUCTURE_KEEPER_LAIR:
                case STRUCTURE_LINK:
                case STRUCTURE_PORTAL:
                case STRUCTURE_WALL:
                case STRUCTURE_STORAGE:
                    return true;

                case STRUCTURE_RAMPART:
                    if (list[i].structure.my === false) {
                        return true;
                    }
                    break;

                case STRUCTURE_ROAD:
                    break;

                default:
                    throw Error('Unknown structure type ' + list[i].structure.structureType);
            }
        }
    }

    return false;
}

module.exports = {
    examinePath: examinePath,
    hasWall: hasWall
};