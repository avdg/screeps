'use strict';

/**
 * Usage Calls command command_<parameter1> to execute its native property if available
 */
var exec = function() {
    if (arguments.length === 0) {
        throw new Error('Expected at least 1 parameter to execute a function');
    }

    var commands = AI.extensions.commands;

    var cmd = arguments[0];

    if (commands[cmd] === undefined) {
        throw new Error("Command " + cmd + " doesn't exist");
    }

    if (commands[cmd].native !== undefined && typeof commands[cmd].native === "function") {
        return commands[cmd].native.apply(null, arguments);
    } else {
        throw new Error("Can't execute command " + cmd + " natively");
    }
};

var parseCommand = function(command) {
    var args = [];
    var pos = 0;
    var start;
    var newPos;

    while (pos < command.length) {

        while (command[pos] === " ") {
            pos++;
        }

        if (command.length <= pos) {
            break;
        }

        if (command[pos] === '"' || command[pos] === "'") {
            start = command[pos];
            args.push("");
            pos++;

            for (newPos = pos; newPos < command.length; newPos++) {
                if (start === command[newPos]) {
                    if (newPos + 1 < command.length && command[newPos + 1] === ' ') newPos++;
                    break;
                }
                if ('\\' === command[newPos] && newPos + 1 < command.length) newPos++;
                args[args.length - 1] += command[newPos];
            }
        } else {
            newPos = command.indexOf(" ", pos);
            if (-1 === newPos) newPos = command.length;
            args.push(command.substr(pos, newPos - pos));
        }
        pos = newPos + 1;
    }
    return args;
};

module.exports = {
    exec: exec,
    parseCommand: parseCommand
};