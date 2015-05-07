'use strict';

function command(flag, parameters) {
    // Does nothing
}

module.exports = {
    exec: command,
    command: "camp",
    help: 'Description:\n- Used to create camp places or markers for creeps\n\nUsage:\n- camp &lt;campName&gt;',
};
