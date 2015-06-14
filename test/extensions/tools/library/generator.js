'use strict';

var assert = require('assert');

var lib = require('../../../../extensions/tools/library/generator');

describe('Library extensions: generator', function() {
    it('Should return a string', function() {
        assert.equal(typeof lib.generator(), "string");
    });
});