'use strict';

var assert = require('assert');

var generics = require('../../scripts/_generics');

describe("Scripts: _generics", function() {
    describe("bufferConsole", function() {
        it('Should buffer console output', function() {
            var f = function () {
                console.log("Hello world!");
                return "foo";
            };
            var buffer = [];

            assert.equal(generics.bufferConsole(f, buffer), "foo");
            assert.deepEqual(buffer, [["Hello world!"]]);
        });

        it('Should expect to be given a buffer', function() {
            var f = function() {
                console.log("Hello world!");
                return "foo";
            };
            var executeWithoutBuffer = function() {
                generics.bufferConsole(f);
            };
            var check = function(e) {
                return e instanceof Error &&
                    e.message === "Invalid buffer given";
            };

            assert.throws(executeWithoutBuffer, check);
        });
    });

    describe('generator', function() {
        it('Should return a string', function() {
            assert.equal(typeof generics.generator(), "string");
        });
    });

    describe('parseCommand', function() {
        it('Should parse these given commands without problems', function() {
            assert.deepEqual(
                generics.parseCommand('test muted sound'),
                ['test', 'muted', 'sound']
            );
            assert.deepEqual(
                generics.parseCommand('test "\\\\mute\\"ed" sound'),
                ['test', '\\mute"ed', 'sound']
            );
            assert.deepEqual(
                generics.parseCommand('test "mute"sound'),
                ['test', 'mute', 'sound']
            );
        });
    });
});