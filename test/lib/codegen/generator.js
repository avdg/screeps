'use strict';

var assert = require('assert');

var generator = require('../../../lib/codegen/generator');

describe('Codegen: generator', function() {
    describe('generate', function() {
        it('Should be able to generate content with nothing to generate', function() {
            var expected = "'use strict';\n\n";
            var code = generator.generate(undefined, {});

            assert.equal(code, expected);
        });

        it ('Should be able to wrap some assigned code', function() {
            var expected = "'use strict';\n\nvar generated = {\ntest: function(){console.log('test');}\n};\n\nvar exec = module.exports = function(){\n    if (typeof global === 'undefined') AI = {}; else global.AI = {};\n    var run = [];\n    for (var i in generated) {var result = generated[i](); if (typeof result === 'function') { run.push(result); } }\n    for (var j in run) { run[j](); }\n};\nexec();";
            var code = generator.generate(undefined, {
                test: {
                    generate: function() {
                        return "function(){console.log('test');}";
                    }
                }
            });

            assert.equal(code, expected);
        });
    });
});