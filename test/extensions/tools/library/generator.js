'use strict';

var assert = require('assert');

var lib = require('../../../../extensions/tools/library/generator');

describe('Library extensions: generator', function() {
    describe('generator', function() {
        var parts = "abcdefghijklmnopqrstuvwxyz0123456789".split("");

        it('Should return a string', function() {
            assert.equal(typeof lib.generator(), "string");
        });

        it('Should obey custom limits', function() {
            var min = 100;
            var max = 0;
            for (var i = 0; i < 100; i++) {
                var result = lib.generator({parts: parts, min: 6, max: 20});
                min = Math.min(min, result.length);
                max = Math.max(max, result.length);
            }

            assert.equal(min, 6);
            assert.equal(max, 20);
        });

        var min = 100;
        var max = 0;
        var table = {};

        for (var a in parts) {
            table[parts[a]] = 0;
        }

        for (var i = 0; i < 100; i++) {
            var result = lib.generator({parts: parts});
            min = Math.min(min, result.length);
            max = Math.max(max, result.length);

            for (var j = 0; j < result.length; j++) {
                table[result[j]]++;
            }
        }

        it("Should obey the default set lengths", function() {
            assert.equal(min, 2);
            assert.equal(max, 5);
        });

        var average = 0;
        var charMin = 100000;
        var charMax = 0;
        for (var k in table) {
            average += table[k];
            charMin = Math.min(charMin, table[k]);
            charMax = Math.max(charMax, table[k]);
        }
        average = average / parts.length;

        it("Generator stats:\n    min char frequency: " + charMin + "\n    max char frequency: " + charMax + "\n    avg char frequency: " + average, function() {
            assert.deepEqual(average >  (200 / parts.length), true);
            assert.deepEqual(charMin >= 0, true);
            assert.deepEqual(charMin <  (500 / parts.length), true);
            assert.deepEqual(charMax >  (200 / parts.length), true);
            assert.deepEqual(charMax <  500, true); // 100 * 5 chars max generated, but they can't be the same char
            assert.deepEqual(charMin < charMax, true);
        });
    });
});