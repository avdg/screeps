function helpCommand(flag, parameters) {
    flag.remove();

    if (!(parameters[1] in commands)) {
        console.log('Flag command help: Command ' + parameters[1] + ' not found');
        return;
    }

    if (!('help' in commands[parameters[1]])) {
        console.log('Flag command help: Command ' + parameters[1] + ' has no help message');
    }

    console.log('Flag command help:\n=== ' + parameters[1] + ' ===\n' + commands[parameters[1]].help);
}

var commands = {
    // FOO:           require('command_FOO'),
    addPriorityQueue: require('command_addPriorityQueue'),
    addQueue:         require('command_addQueue'),
    camp:             require('command_camp'),
    removeFlag:       require('command_removeFlag'),
};

commands.help = {
    exec: helpCommand,
    command: "help",
    help: "Description:\n- Shows users how to use a command\n\nUsages:\n- help [&lt;command&gt;]",
};

module.exports = commands;
