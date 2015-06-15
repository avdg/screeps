'use strict';

var assert = require('assert');

var lib = require('../../../../extensions/tools/library/creep');

describe('Library extensions: creep', function() {
    describe('getCreepCost', function() {
        it('Should return a number higher than 0 when giving an array of body parts', function() {
            var result = lib.getCreepCost([TOUGH]);

            assert.equal(typeof result, "number");
            assert.equal(result > 0, true);
        });

        it('Should return -1 when invalid parts are passed', function() {
            var result = lib.getCreepCost(["foo"]);

            assert.equal(typeof result, "number");
            assert.equal(result === -1, true);
        });
    });
});