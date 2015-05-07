'use strict';

function helpCommand(flag, parameters) {
    var commands = Game.extensions.commands;
    var commandFilter = function(input) {
        return function(command) {
            return command.indexOf(input) !== -1 || input.indexOf(command) !== -1;
        };
    };

    flag.remove();

    // List commands if no command has been given
    if (parameters.length <= 1) {
        console.log(
            'Flag command help:\n\n' + 'Available commands:\n' +
            Object.keys(commands).sort().join(', ') +
            '\n\nUse "help &lt;command&gt;" for more information'
        );
        return;
    }

    // Test if command is available
    if (!(parameters[1] in commands)) {
        var msg = 'Flag command help: Command ' + parameters[1] + ' not found';
        var similar = Object.keys(commands).filter(commandFilter(parameters[1])).sort().join(', ');

        if (similar !== "")
            msg += '\n\nSimilar commands:\n' + similar +
                '\n\nUse "help &lt;command&gt;" for more information';

        console.log(msg);
        return;
    }

    // Test if command has help info
    if (!('help' in commands[parameters[1]])) {
        console.log('Flag command help: Command ' + parameters[1] + ' exists, but has no help message');
        return;
    }

    // Show help
    console.log('Flag command help:\n=== ' + parameters[1] + ' ===\n' + commands[parameters[1]].help);
}

module.exports = {
    exec: helpCommand,
    command: "help",
    help: "Description:\n- Shows users how to use a command\n\nUsages:\n- help [&lt;command&gt;]",
};
