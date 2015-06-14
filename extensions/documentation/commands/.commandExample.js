'use strict';

function command(flag, parameters) {

}

function native(parameter1, parameter2) {

}

module.exports = {
    name: "FOO",
    exec: command, // Usage flag 'command [parameter1 [, ...]]'
    native: native, // When called by AI.exec('command');
    help: 'Description:\n- Executes Foo\n\nUsage:\n- FOO',
};
