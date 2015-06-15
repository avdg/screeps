'use strict';

var assert = require('assert');

var generics = require('../../scripts/_generics.js');
var utils = require('../../scripts/_utils');

function reset() {
    require('../../lib/mocks/gameStateStart')();
}

function includeGenerated() {
    assert.equal(typeof AI === "object" && AI.extensions === "object", false);

    require('../../lib/mocks/deploy/_generated.js')();
}

describe("Scripts: _utils", function() {
    beforeEach(reset);

    describe('getTmp', function() {
        beforeEach(includeGenerated);

        it('Should return an empty object', function() {
            assert.deepEqual(utils.getTmp(), {});
        });

        it('Should remember set values', function() {
            var tmp = utils.getTmp();
            assert.deepEqual(tmp, {});

            tmp.foo = "bar";
            assert.deepEqual(utils.getTmp(), tmp);
            assert.deepEqual(utils.getTmp(), {foo: "bar"});
        });

        it('Should be empty on the next round', function() {
            assert.deepEqual(utils.getTmp(), {});
        });
    });

    describe('dontRepeat', function() {
        it('Should return true if message is unique', function() {
            assert.strictEqual(utils.dontRepeat('Spam!', 'test'), true);
        });

        it('Should return undefined if message is send twice in same round', function() {
            assert.strictEqual(utils.dontRepeat('Spam!', 'test'), true);
            assert.strictEqual(utils.dontRepeat('Spam!', 'test'), undefined);
            assert.strictEqual(utils.dontRepeat('Spam!', 'test'), undefined);
        });

        it('Should return false if message was send previous round', function() {
            assert.strictEqual(utils.dontRepeat('Spam!', 'test'), true);

            // Enter new game tick
            Game.time++;

            assert.strictEqual(utils.dontRepeat('Spam!', 'test'), false);
            assert.strictEqual(utils.dontRepeat('Spam!', 'test'), undefined);
            assert.strictEqual(utils.dontRepeat('Spam!', 'test'), undefined);
        });

        it('Should forget the message after 2 turns', function() {
            assert.strictEqual(utils.dontRepeat('Spam!', 'test'), true);

            // Move 2 game ticks further
            Game.time++;
            Game.time++;

            assert.strictEqual(utils.dontRepeat('Spam!', 'test'), true);
            assert.strictEqual(utils.dontRepeat('Spam!', 'test'), undefined);
            assert.strictEqual(utils.dontRepeat('Spam!', 'test'), undefined);
        });
    });

    describe('logOnce', function() {
        it('Should only only produce 1 message if repeated in same round', function() {
            var buffer = [];
            var f = function() {
                utils.logOnce("Test");
                utils.logOnce("Test");
            };

            assert.equal(generics.bufferConsole(f, buffer), undefined);
            assert.deepEqual(buffer, [["Test"]]);
        });

        it('Should give warnings if requested', function() {
            var buffer = [];
            var f = function() {
                utils.logOnce("Test", true);
                utils.logOnce("Test", true);
            };

            assert.equal(generics.bufferConsole(f, buffer), undefined);
            assert.deepEqual(
                buffer,
                [["Test"], ["Warning: reusing message \"Test\" in same round"]]
            );
        });

        it('Should ignore messages repeated in the next round', function() {
            var buffer = [];
            var f = function() {
                utils.logOnce("Test");

                // Enter new game tick
                Game.time++;
                utils.logOnce("Test");
            };

            assert.equal(generics.bufferConsole(f, buffer), undefined);
            assert.deepEqual(buffer, [["Test"]]);
        });

        it('Should not warn about ignored messages in next round', function() {
            var buffer = [];
            var f = function() {
                utils.logOnce("Test", true);

                // Enter new game tick
                Game.time++;
                utils.logOnce("Test", true);
            };

            assert.equal(generics.bufferConsole(f, buffer), undefined);
            assert.deepEqual(buffer, [["Test"]]);
        });
    });
});