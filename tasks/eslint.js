'use strict';

var path = require('path');

var eslint = require('./eslint-rules-mapper').map;

module.exports = function(grunt) {
    grunt.registerTask('eslint-mapper', 'Converts a jshintrc file to eslintrc compatible output', function() {
        var options = this.options({
            src: path.join(__dirname, '../.jshintrc'),
            dest: path.join(__dirname, '../.eslintrc')
        });

        var content = grunt.file.readJSON(options.src);
        content = JSON.stringify(eslint(content));
        grunt.file.write(options.dest, content);
    });
};