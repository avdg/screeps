'use strict';

var path = require('path');

var codeGenerator = require('../lib/codegen/generator');

module.exports = function(grunt) {
    grunt.registerTask('screepsCodeGenerator', 'Generates code to set up ai environment, also sets up the AI API', function() {
        var options = this.options({
            'extensions': path.join(__dirname, "../extensions"),
            'output': path.join(__dirname, "../build/deploy/_generated.js")
        });

        var code = codeGenerator.generate(options);
        grunt.file.write(options.output, code);
    });
};