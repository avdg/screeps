'use strict';

var path = require('path');

var codeGenerator = require('../lib/codegen/generator');

function uglify(src) {
    var Uglify = require("uglify-js");

    var options = {
        compress: {
            screw_ie8: true
        },
        output: {
            indent_level: 2,
            beautify: true,
            max_line_len: 100
        }
    };

    var compressor = Uglify.Compressor(options.compress);

    var ast = Uglify.parse(src, {filename: "_generated.js"});
    ast.figure_out_scope();
    ast = ast.transform(compressor);

    return ast.print_to_string(options.output);
}

module.exports = function(grunt) {
    grunt.registerTask('screepsCodeGenerator', 'Generates code to set up ai environment, also sets up the AI API', function() {
        var options = this.options({
            extensions: path.join(__dirname, "../extensions"),
            scripts: path.join(__dirname, "../scripts"),
            output: path.join(__dirname, "../build/deploy/_generated.js"),
            minify: false
        });

        var code = codeGenerator.generate(options);

        if (options.minify === true) {
            grunt.file.write(options.output.replace(/\.js$/, '') + '/_generated.js', code);

            code = uglify(code);
        }

        grunt.file.write(options.output, code);
    });
};