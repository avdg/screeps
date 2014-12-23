var commands = require('commands');

/**
 * Usage Calls command command_<parameter1> to execute its native property if available
 */
var exec = function() {
    if (arguments.length == 0) {
        throw 'Expected at least 1 parameter to execute a function';
    }

    var cmd = arguments[0];

    if (cmd in commands && native in commands[cmd]) {
        return commands[cmd].native.apply(null, arguments);
    } else {
        throw 'Command not found';
    }
}

module.exports = {
    exec: exec,
};
