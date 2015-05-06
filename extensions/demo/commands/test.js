'use strict';

function command(flag, parameters) {
    console.log("Hello world");
}

module.exports = {
    exec: command,
    command: "test",
    native: null, // require('_utils').exec('command');
    help: 'Description:\n- Executes Test\n\nUsage:\n- Test',
};