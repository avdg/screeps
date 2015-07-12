'use strict';

var assert = require('assert');

var lib = require('../../../../extensions/tools/library/utils');

function reset() {
    require('../../../../lib/mocks/gameStateStart')();
}

function includeGenerated() {
    reset();

    assert.equal(typeof AI === "object" && AI.extensions === "object", false);

    require('../../../../lib/mocks/deploy/_generated.js')();
}

describe("Library extensions: utils", function() {
    describe("bufferConsole", function() {
        it('Should buffer console output', function() {
            var f = function () {
                console.log("Hello world!");
                return "foo";
            };
            var buffer = [];

            assert.equal(lib.bufferConsole(f, buffer), "foo");
            assert.deepEqual(buffer, [["Hello world!"]]);
        });

        it('Should expect to be given a buffer', function() {
            var f = function() {
                console.log("Hello world!");
                return "foo";
            };
            var executeWithoutBuffer = function() {
                lib.bufferConsole(f);
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
                throw new Error("Error!");
            };
            var executeBufferConsole = function() {
                lib.bufferConsole(f, buffer);
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

    describe('dontRepeat', function() {
        beforeEach(reset);

        it('Should return true if message is unique', function() {
            assert.strictEqual(lib.dontRepeat('Spam!', 'test'), true);
        });

        it('Should return undefined if message is send twice in same round', function() {
            assert.strictEqual(lib.dontRepeat('Spam!', 'test'), true);
            assert.strictEqual(lib.dontRepeat('Spam!', 'test'), undefined);
            assert.strictEqual(lib.dontRepeat('Spam!', 'test'), undefined);
        });

        it('Should return false if message was send previous round', function() {
            assert.strictEqual(lib.dontRepeat('Spam!', 'test'), true);

            // Enter new game tick
            Game.time++;

            assert.strictEqual(lib.dontRepeat('Spam!', 'test'), false);
            assert.strictEqual(lib.dontRepeat('Spam!', 'test'), undefined);
            assert.strictEqual(lib.dontRepeat('Spam!', 'test'), undefined);
        });

        it('Should forget the message after 2 turns', function() {
            assert.strictEqual(lib.dontRepeat('Spam!', 'test'), true);

            // Move 2 game ticks further
            Game.time++;
            Game.time++;

            assert.strictEqual(lib.dontRepeat('Spam!', 'test'), true);
            assert.strictEqual(lib.dontRepeat('Spam!', 'test'), undefined);
            assert.strictEqual(lib.dontRepeat('Spam!', 'test'), undefined);
        });
    });

    describe('getTimeDiff', function() {
        it('Should return a difference', function() {
            assert.strictEqual(lib.getTimeDiff(1, 11), 10);
        });

        it ('Should cut off decimals to 2 digits precision', function() {
            assert.strictEqual(lib.getTimeDiff(1.12345678, 12.23456789) - 11.11 < 0.1, true);
        });
    });

    describe('getTmp', function() {
        beforeEach(includeGenerated);

        it('Should return an empty object', function() {
            assert.deepEqual(lib.getTmp(), {});
        });

        it('Should remember set values', function() {
            var tmp = lib.getTmp();
            assert.deepEqual(tmp, {});

            tmp.foo = "bar";
            assert.deepEqual(lib.getTmp(), tmp);
            assert.deepEqual(lib.getTmp(), {foo: "bar"});
        });

        it('Should be empty on the next round', function() {
            assert.deepEqual(lib.getTmp(), {});
        });
    });

    describe('logOnce', function() {
        beforeEach(reset);

        it('Should only only produce 1 message if repeated in same round', function() {
            var buffer = [];
            var f = function() {
                lib.logOnce("Test");
                lib.logOnce("Test");
            };

            assert.equal(lib.bufferConsole(f, buffer), undefined);
            assert.deepEqual(buffer, [["Test"]]);
        });

        it('Should give warnings if requested', function() {
            var buffer = [];
            var f = function() {
                lib.logOnce("Test", true);
                lib.logOnce("Test", true);
            };

            assert.equal(lib.bufferConsole(f, buffer), undefined);
            assert.deepEqual(
                buffer,
                [["Test"], ["Warning: reusing message \"Test\" in same round"]]
            );
        });

        it('Should ignore messages repeated in the next round', function() {
            var buffer = [];
            var f = function() {
                lib.logOnce("Test");

                // Enter new game tick
                Game.time++;
                lib.logOnce("Test");
            };

            assert.equal(lib.bufferConsole(f, buffer), undefined);
            assert.deepEqual(buffer, [["Test"]]);
        });

        it('Should not warn about ignored messages in next round', function() {
            var buffer = [];
            var f = function() {
                lib.logOnce("Test", true);

                // Enter new game tick
                Game.time++;
                lib.logOnce("Test", true);
            };

            assert.equal(lib.bufferConsole(f, buffer), undefined);
            assert.deepEqual(buffer, [["Test"]]);
        });
    });
});