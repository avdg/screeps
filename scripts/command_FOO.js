function command(flag, parameters) {

}

module.exports = {
    exec: command,
    command: "FOO",
    native: null, // require('_utils').exec('command');
    help: 'Description:\n- Executes Foo\n\nUsage:\n- FOO',
};
