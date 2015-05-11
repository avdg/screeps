'use strict';

function command(flag, parameters) {

}

module.exports = {
    exec: command,
    command: "FOO",
    native: null, // AI.exec('command');
    help: 'Description:\n- Executes Foo\n\nUsage:\n- FOO',
};
