'use strict';

var assert = require('assert');
var simple = require('simple-mock');

var lib = require('../../../../extensions/tools/library/room');

function reset() {
    require('../../../../lib/mocks/gameStateStart')();
}

describe('Library extensions: room', function() {
    beforeEach(reset);

    describe('countEmptyTilesAround', function() {
        it('Should count tiles around a given position (1)', function() {
            Game.rooms.test = {};

            var fn1 = simple.mock(Game.rooms.test, 'lookAtArea').returnWith({
                7: {
                    2: [],
                    3: [],
                    4: []
                },
                8: {
                    2: [],
                    3: [],
                    4: []
                },
                9: {
                    2: [],
                    3: [],
                    4: []
                }
            });

            assert.equal(8, lib.countEmptyTilesAround(3, 8, 'test'));
        });

        it('Should count tiles around a given position (2)', function() {
            Game.rooms.test = {};

            var fn = simple.mock(Game.rooms.test, 'lookAtArea').returnWith({
                7: {
                    2: [],
                    3: [{type: 'terrain', terrain: 'wall'}],
                    4: []
                },
                8: {
                    2: [],
                    3: [],
                    4: []
                },
                9: {
                    2: [],
                    3: [],
                    4: []
                }
            });

            assert.equal(lib.countEmptyTilesAround({x: 3, y: 8, roomName: 'test'}), 7);
            assert.equal(fn.callCount, 1);
        });

        it('Should return undefined when a an edge position is given', function() {
            assert.strictEqual(lib.countEmptyTilesAround(-1, 3, 'test'), undefined);
        });
    });

    describe('examinePath', function() {
        it('Should be able to count swamps, plains and roads', function() {
            var path = [
                {x: 2, y: 3},
                {x: 3, y: 3},
                {x: 3, y: 4},
                {x: 4, y: 5},
                {x: 5, y: 5},
                {x: 6, y: 6}
            ];

            var grid = {
                2: {
                    3: []
                },
                3: {
                    3: [{type: 'terrain', terrain: 'swamp'}],
                    4: [{type: 'construction', structure: {type: 'road'}}]
                },
                4: {
                    5: []
                },
                5: {
                    5: [{type: 'terrain', terrain: 'swamp'}]
                },
                6: {
                    6: [{type: 'terrain', terrain: 'swamp'}]
                }
            };

            var room = {
                lookAt: function(obj) {
                    return grid[obj.x][obj.y];
                }
            };

            var fn = simple.mock(room, 'lookAt');

            assert.deepEqual(lib.examinePath(path, room), {
                road: 1,
                plain: 2,
                swamp: 3
            });
            assert.equal(fn.callCount, 6);
        });
    });

    describe('hasWall', function() {
        var tests = [
            {
                test: 'Should return undefined if no list is provided',
                input: [undefined, undefined],
                output: true
            },
            {
                test: 'Should return "blah" if no list provided and return value set to "blah"',
                input: [undefined, "blah"],
                output: "blah"
            },
            {
                test: 'Should return false if array is empty',
                input: [[]],
                output: false
            },
            {
                test: 'Any terrain with a wall should be avoided',
                input: [[{type: 'terrain', terrain: 'wall'}]],
                output: true
            },
            {
                test: 'Any terrain with lava should be avoided',
                input: [[{type: 'terrain', terrain: 'lava'}]],
                output: true
            },
            {
                test: 'Any terrain with swamps or plains only do not represent walls',
                input: [[{type: 'terrain', terrain: 'plain'}, {type: 'terrain', terrain: 'swamp'}]],
                output: false
            },
            {
                test: 'Any structure that represents a controller should be avoided',
                input: [[{type: 'structure', structureType: STRUCTURE_CONTROLLER}]],
                output: true
            },
            {
                test: 'Any structure that represents an extension should be avoided',
                input: [[{type: 'structure', structureType: STRUCTURE_EXTENSION}]],
                output: true
            },
            {
                test: 'Any structure that represents a keeper lair should be avoided',
                input: [[{type: 'structure', structureType: STRUCTURE_KEEPER_LAIR}]],
                output: true
            },
            {
                test: 'Any structure that represents a link should be avoided',
                input: [[{type: 'structure', structureType: STRUCTURE_LINK}]],
                output: true
            },
            {
                test: 'Any structure that represents a portal should be avoided',
                input: [[{type: 'structure', structureType: STRUCTURE_PORTAL}]],
                output: true
            },
            {
                test: 'Any structure that represents a wall should be avoided',
                input: [[{type: 'structure', structureType: STRUCTURE_WALL}]],
                output: true
            },
            {
                test: 'Any structure that represents a hostile rampart should be avoided',
                input: [[{type: 'structure', structureType: STRUCTURE_RAMPART, my: false}]],
                output: true
            },
            {
                test: 'Any structure that represents a friendly rampart or road should not represent walls',
                input: [[
                    {type: 'structure', structureType: STRUCTURE_RAMPART, my: true},
                    {type: 'structure', structureType: STRUCTURE_ROAD}
                ]],
                output: false
            },
            {
                test: 'Just for some good measure',
                input: [[
                    {type: 'structure', structureType: STRUCTURE_CONTROLLER},
                    {type: 'structure', structureType: STRUCTURE_LINK}
                ]],
                output: true
            }
        ];

        var run = function(test) {
            return function() {
                assert.deepEqual(lib.hasWall(test.input[0], test.input[1]), test.output);
            };
        };

        for (var test of tests) {
            it(test.test, run(test));
        }
    });
});