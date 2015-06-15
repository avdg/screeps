'use strict';

var assert = require('assert');

var globalsCodegen = require('../../../lib/codegen/globals');

describe('Codegen: globals', function() {
    describe('generate', function() {
        it('Should generate code', function() {
            var result = "function() {\n    var _ = require('lodash');\n\n    _.merge(AI, require('_settings'));\n}";

            assert.equal(globalsCodegen.generate(), result);
        });

        it('Should generate adaptive code if provided option globalModules', function() {
            var result = "function() {\n    var _ = require('lodash');\n\n    _.merge(AI, require('foo'));\n}";

            assert.equal(globalsCodegen.generate({globalModules: ['foo']}), result);
        });

        it('Should generate code if options has globalModules and type is a string', function() {
            var result = "function() {\n    var _ = require('lodash');\n\n    _.merge(AI, require('foo'));\n}";

            assert.equal(globalsCodegen.generate({globalModules: 'foo'}), result);
        });
    });
});