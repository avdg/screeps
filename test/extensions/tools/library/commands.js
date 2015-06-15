'use strict';

var assert = require('assert');
var _ = require('lodash');

var lib = _.merge(
    require('../../../../extensions/tools/library/commands'),
    require('../../../../extensions/tools/library/utils')
);

function includeGenerated() {
    assert.equal(typeof AI === "object" && AI.extensions === "object", false);

    require('../../../../lib/mocks/deploy/_generated.js')();
}

describe('Library extensions: commands', function() {
    describe('exec', function() {
        beforeEach(includeGenerated);

        it('Should fail when no arguments are passed', function() {
            var executeWithoutParameters = function() {
                lib.exec();
            };

            var errorValidator = function(e) {
                return e instanceof Error &&
                    e.message === "Expected at least 1 parameter to execute a function";
            };

            assert.throws(executeWithoutParameters, errorValidator);
        });

        it('Should fail when the requested command isn\'t available', function() {
            var buffer = [];
            var executeUnavailableCommand = function() {
                lib.bufferConsole(lib.exec('notAvailable'), buffer);
            };
            var errorValidator = function(e) {
                return e instanceof Error &&
                    e.message === "Command notAvailable doesn't exist";
            };

            assert.throws(executeUnavailableCommand, errorValidator);
            assert.deepEqual(buffer, []);
        });

        it('Should fail when the requested command doesn\'t have a native function', function() {
            var buffer = [];
            var executeNativelessCommand = function() {
                lib.bufferConsole(lib.exec('test'), buffer);
            };
            var errorValidator = function(e) {
                return e instanceof Error &&
                    e.message === "Can't execute command test natively";
            };

            assert.throws(executeNativelessCommand, errorValidator);
            assert.deepEqual(buffer, []);
        });

        it('Should execute the native function when available', function() {
            var buffer = [];

            assert.equal(
                lib.bufferConsole(
                    function() {
                        lib.exec('testWithNative');
                    },
                    buffer
                ),
                undefined
            );
            assert.deepEqual(buffer, [["Hello world"]]);
        });
    });

    describe('parseCommand', function() {
        it('Should parse these given commands without problems', function() {
            assert.deepEqual(
                lib.parseCommand('test muted sound'),
                ['test', 'muted', 'sound']
            );
            assert.deepEqual(
                lib.parseCommand('test "\\\\mute\\"ed" sound'),
                ['test', '\\mute"ed', 'sound']
            );
            assert.deepEqual(
                lib.parseCommand('test "mute"sound'),
                ['test', 'mute', 'sound']
            );
        });
        it('Should be able to handle multiple whitespaces', function() {
            assert.deepEqual(
                lib.parseCommand('   '),
                []
            );
            assert.deepEqual(
                lib.parseCommand('     test 1  2   3'),
                ['test', '1', '2', '3']
            );
        });
    });
});