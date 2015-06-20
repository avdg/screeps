'use strict';

var assert = require('assert');
var _ = require('lodash');

var lib = _.merge(
    require('../../../../extensions/tools/library/compress'),
    require('../../../../extensions/tools/library/utils')
);

var inputs = [
    'Some very very very very long long input',
    'This is another input to test something very long',
    'Yep, this is another test 0123456789',
    '\t',
    '\t\t',
    'aa',
    'abcd',
    '\0\0',
    '\0\0\0\0\0\0\0',
    '\xfe\xfe',
    '\x7f\x7f',
    '\xff\xff'
];

var numbers = [
    {test: 0, base94: ' ', base91: '!'},
    {test: 1, base94: "!", base91: "#"},
    {test: 90, base94: "|", base91: "~"},
    {test: 91, base94: "}", base91: "#!"},
    {test: 93, base94: "\x7f", base91: "#$"},
    {test: 94, base94: "! ", base91: "#%"},
    {test: -94, base94: "\\! ", base91: "-#%"}
];

describe('Library extensions: encode', function() {
    describe('base91', function() {
        numbers.forEach(function(input) {
            it('Should encode ' + input.test + ' to ' + input.base91, function() {
                assert.equal(lib.base91.encode(input.test), input.base91);
            });
            it('Should decode ' + input.base91 + ' to ' + input.test, function() {
                assert.equal(lib.base91.decode(input.base91), input.test);
            });
        });
    });

    describe('base94', function() {
        numbers.forEach(function(input) {
            it('Should encode ' + input.test + ' to ' + input.base94, function() {
                assert.equal(lib.base94.encode(input.test), input.base94);
            });
            it('Should decode ' + input.base94 + ' to ' + input.test, function() {
                assert.equal(lib.base94.decode(input.base94), input.test);
            });
        });
    });

    describe('getCustomBase', function() {
        it('Should be able to retrieve a custom base', function() {
            var customBase = lib.getCustomBase({chars: [0, 1]});

            for (var i = 0; i < numbers.length; i++) {
                assert.equal(customBase.encode(numbers[i].test), numbers[i].test.toString(2));
            }
        });

        it('Should be able to survive invalid numbers', function() {
            var customBase = lib.getCustomBase({chars: [0, 1]});

            assert.equal(customBase.encode(NaN), undefined);
        });

        it('Shouldn\'t allow custom bases with a character representing a negative number in chars', function() {
            var passInvalidNegativeChar = function() {
                var customBase = lib.getCustomBase({chars: [0, 1], negative: 0});
            };
            var validateError = function(e) {
                return e instanceof Error &&
                    e.message === "Found negative sign 0 in chars [0,1]";
            };

            assert.throws(passInvalidNegativeChar, validateError);
        });

        it('Should be able to retreive its chars and negative characters', function() {
            var customBase = lib.getCustomBase({chars: [0, 1], negative: '+'});

            assert.deepEqual(customBase.chars, [0, 1]);
            assert.equal(customBase.negative, '+');
        });
    });

    describe('encodeBinary', function() {
        inputs.forEach(function(input) {
            it('Should be able to accept some inputs ' + input, function() {
                var output = lib.encodeBinary(input);
                assert.equal(output.length > 0, true);
                assert.equal(output.length < Math.max(input.length * 1.5, 4.01 + input.length / 2), true,
                    output.length + ' vs original ' + input.length
                );
            });
        });

        it("Shouldn't allow illegal input", function() {
            var passInvalidRange = function() {
                lib.encodeBinary(String.fromCharCode(0x100));
            };
            var validateError = function(e) {
                return e instanceof Error &&
                    e.message === "Input with code point 256 out of range of 255 chars";
            };

            assert.throws(passInvalidRange, validateError);
        });
    });

    describe('decodeBinary', function() {
        inputs.forEach(function(input) {
            it('Should be able to decode the encoded version of the text ' + input, function() {
                assert.equal(lib.decodeBinary(lib.encodeBinary(input)), input, JSON.stringify([
                    lib.encodeBinary(input),
                    input,
                    lib.decodeBinary(lib.encodeBinary(input))
                ]));
            });
        });

        it("Shouldn't get stuck on empty inputs", function() {
            assert.equal(lib.decodeBinary(""), "");
        });
    });
});