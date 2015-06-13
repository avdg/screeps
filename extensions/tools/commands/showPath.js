'use strict';

var flagName = "";
function showPath(pos1, pos2, options) {
    options = options || {};
    options.flags = typeof options.flags === "number" && options.flags || 3;
    options.delay = typeof options.delay === "number" && options.delay || 1;
    options.color = options.color || COLOR_BROWN;

    var path = pos1.findPathTo(pos2);

    if (path.length < 1)
        return;

    path.unshift({x: pos1.x, y: pos1.y});

    var flagPaths = [];

    for (var i = 0; i < options.flags; i++) {
        flagPaths.push([]);
    }

    // Divide path over flags
    for (var j = 0; j < path.length; j++) {
        flagPaths[j % options.flags].push(path[j]);
    }

    // Create flags
    var pos;
    for (var k = 0; k < options.flags; k++) {
        pos = flagPaths[k].shift();
        pos = new RoomPosition(pos.x, pos.y, pos1.roomName);
        do {
            flagName += " ";
        } while (
            Game.rooms[pos1.roomName].createFlag(pos, flagName, options.color) < 0
        );

        Memory.flags[flagName] = {
            path: flagPaths[k],
            ticks: options.flags * options.delay,
            ticksToLive: k * options.delay + 1,
            handler: "showPath"
        };
    }
}

function countDown(flag) {
    if (--flag.memory.ticksToLive > 0) {
        return;
    }

    var pos;

    if (!flag.memory.path ||
        (pos = flag.memory.path.shift()) === undefined
    ) {
        var name = flag.name;
        flag.remove();
        Memory.flags[name] = undefined;
        return;
    }

    flag.setPosition(new RoomPosition(pos.x, pos.y, flag.pos.roomName));
    flag.memory.ticksToLive = flag.memory.ticks;
}

function exec(flag, parameters) {
    if (parameters.length === 0) {
        return countDown(flag);
    }

    var pos1, pos2, options;
    if (parameters.length >= 5) {
        pos1 = new RoomPosition(parseInt(parameters[1]), parseInt(parameters[2]), flag.pos.roomName);
        pos2 = new RoomPosition(parseInt(parameters[3]), parseInt(parameters[4]), flag.pos.roomName);
        options = JSON.parse(parameters[5] || "{}");

    } else if (parameters.length >= 2) {
        pos1 = flag.pos;
        pos2 = new RoomPosition(parseInt(parameters[1]), parseInt(parameters[2]), flag.pos.roomName);
        options = JSON.parse(parameters[3] || "{}");

    } else {
        flag.remove();
        console.log("Command showPath: Invalid arguments provided");
        return;
    }

    showPath(pos1, pos2, options);
    flag.remove();
}

function native(command, pos1, pos2, options) {
    return showPath(pos1, pos2, options);
}

module.exports = {
    exec: exec,
    native: native,
    command: 'showPath',
    help: 'Description:\n- Shows a path\n\nUsage:\n- showPath &lt;destX&gt; &lt;destY&gt; [{options}]\n- showPath &lt;x1&gt; &lt;y1&gt; &lt;x2&gt; &lt;y2&gt; [{options}]',
    test: {
        countDown: countDown,
        showPath: showPath,
        reset: function() { flagName = ""; }
    }
};