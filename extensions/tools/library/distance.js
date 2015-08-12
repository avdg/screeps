'use strict';

var distance = function(x1, y1, x2, y2) {
    if (x1 instanceof Object && x1.pos instanceof RoomPosition) {
        x1 = x1.pos;
    }

    if (y1 instanceof Object && y1.pos instanceof RoomPosition) {
        y1 = y1.pos;
    }

    if (x1 instanceof RoomPosition && y1 instanceof RoomPosition &&
        x1.roomName !== y1.roomName
    ) {
        return ERR_NOT_IN_RANGE;
    }

    if (x1 instanceof Object && y1 instanceof Object) {
        y2 = y1.y;
        x2 = y1.x;
        y1 = x1.y;
        x1 = x1.x;
    }

    return Math.sqrt(
        Math.abs(Math.pow(x2 - x1, 2)) +
        Math.abs(Math.pow(y2 - y1, 2))
    );
};

var manhattanDistance = function(x1, y1, x2, y2) {
    if (x1 instanceof Object && x1.pos instanceof RoomPosition) {
        x1 = x1.pos;
    }

    if (y1 instanceof Object && y1.pos instanceof RoomPosition) {
        y1 = y1.pos;
    }

    if (x1 instanceof RoomPosition && y1 instanceof RoomPosition &&
        x1.roomName !== y1.roomName
    ) {
        return ERR_NOT_IN_RANGE;
    }

    if (x1 instanceof Object && y1 instanceof Object) {
        y2 = y1.y;
        x2 = y1.x;
        y1 = x1.y;
        x1 = x1.x;
    }

    return Math.abs(x2 - x1) + Math.abs(y2 - y1);
};

module.exports = {
    distance: distance,
    manhattanDistance: manhattanDistance
};
