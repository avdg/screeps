'use strict';

module.exports = function(grunt) {

    grunt.task.registerTask('run', 'Dry running a bot', function() {
        var child = require('child_process');

        if (typeof child.execSync !== "function") {
            console.log("Skipping - no child_process.execSync found - available in node 0.12+");
            return;
        }

        var result = child.execSync('node lib/simulator/run.js', {
            encoding: 'utf-8'
        });

        if (typeof result === "object") {
            console.log(Object.keys(result), JSON.stringify(result.error), result.file, result.stdout);
        } else {
            console.log(result);
        }
    });
};