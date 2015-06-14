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

        it('Should catch errors and rethrow to avoid console.log dereferences', function() {
            var backup = console.log;
            var buffer = [];
            var f = function() {
                throw Error("Error!");
            };
            var executeBufferConsole = function() {
                generics.bufferConsole(f, buffer);
            };
            var check = function(e) {
                return e instanceof Error &&
                    e.message === "Error!";
            };

            assert.throws(executeBufferConsole, check);
            assert.strictEqual(console.log, backup);
            assert.deepEqual(buffer, []);
        });
    });

    describe('getTimeDiff', function() {
        it('Should return a difference', function() {
            assert.equal(generics.getTimeDiff(1, 11), 10);
        });

        it ('Should cut off decimals to 2 digits precision', function() {
            assert.equal(generics.getTimeDiff(1.12345678, 12.23456789), 11.11);
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
        it('Should be able to handle multiple whitespaces', function() {
            assert.deepEqual(
                generics.parseCommand('   '),
                []
            );
            assert.deepEqual(
                generics.parseCommand('     test 1  2   3'),
                ['test', '1', '2', '3']
            );
        });
    });
});