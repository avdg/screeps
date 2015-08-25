'use strict';

var timeout = 3600;

function checkEnemies() {
    var enemies = [];

    if (Memory.permanent.enemies === undefined) {
        Memory.permanent.enemies = {};
    }

    for (var room in Game.rooms) {
        if (Game.rooms[room].mode === MODE_SURVIVAL) {
            continue;
        }

        enemies = enemies.concat(Game.rooms[room].find(FIND_HOSTILE_CREEPS));
    }

    for (var i = 0; i < enemies.length; i++) {
        if (enemies[i].owner.username === "Source Keeper") {
            continue;
        }

        if (Memory.permanent.enemies[enemies[i].owner.username] !== undefined &&
            (Memory.permanent.enemies[enemies[i].owner.username] + timeout) > Game.time
        ) {
            continue;
        }

        var message = "Found enemy " + enemies[i].owner.username + " at round " + Game.time + " in room " + room;
        Game.notify(message);
        console.log(message);
        Memory.permanent.enemies[enemies[i].owner.username] = Game.time;
    }
}

function firstTurn() {
}

function preController() {
    checkEnemies();
}

function postController() {
}

module.exports = {
    firstTurn: firstTurn,
    preController: preController,
    postConstroller: postController
};