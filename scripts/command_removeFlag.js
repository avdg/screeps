function command(flag, parameters) {
    flag.remove();
    console.log('Flag command removeFlag: removed ' + flag.name);
}

module.exports = {
    exec: command,
    command: "removeFlag",
    help: 'Description:\n- Removes its own flag\n\nUsage:\n- removeFlag',
};
