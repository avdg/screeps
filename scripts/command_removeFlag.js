function command(flag, parameters) {
    flag.remove();
    console.log('Flag command removeFlag: removed ' + flag.name);
}

module.exports = {
    exec: command,
    command: "removeFlag",
};
