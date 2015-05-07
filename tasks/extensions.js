'use strict';

var path = require('path');

var generateExtensionsCode = require('../lib/codegen/extensions');

module.exports = function(grunt) {
    grunt.registerTask('screepsParseAiExtensions', 'Generates code from extensions and put them in Game.extensions', function() {
        var options = this.options({
            'src': path.join(__dirname, "../extensions"),
            'output': path.join(__dirname, "../build/deploy/_generated.js")
        });

        var code = generateExtensionsCode.parse(options);
        grunt.file.write(options.output, code);
    });
};