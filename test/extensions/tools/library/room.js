'use strict';

var assert = require('assert');
var simple = require('simple-mock');

var lib = require('../../../../extensions/tools/library/room');

function reset() {
    require('../../../../lib/mocks/gameStateStart')();
}

describe('Library extensions: room', function() {
    beforeEach(reset);

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
                input: [[{type: 'structure', structure: {
                    structureType: STRUCTURE_CONTROLLER}
                }]],
                output: true
            },
            {
                test: 'Any structure that represents an extension should be avoided',
                input: [[{type: 'structure', structure: {
                    structureType: STRUCTURE_EXTENSION
                }}]],
                output: true
            },
            {
                test: 'Any structure that represents a keeper lair should be avoided',
                input: [[{type: 'structure', structure: {
                    structureType: STRUCTURE_KEEPER_LAIR
                }}]],
                output: true
            },
            {
                test: 'Any structure that represents a link should be avoided',
                input: [[{type: 'structure', structure: {
                    structureType: STRUCTURE_LINK
                }}]],
                output: true
            },
            {
                test: 'Any structure that represents a portal should be avoided',
                input: [[{type: 'structure', structure: {
                    structureType: STRUCTURE_PORTAL
                }}]],
                output: true
            },
            {
                test: 'Any structure that represents a wall should be avoided',
                input: [[{type: 'structure', structure: {
                    structureType: STRUCTURE_WALL
                }}]],
                output: true
            },
            {
                test: 'Any structure that represents a hostile rampart should be avoided',
                input: [[{type: 'structure', structure: {
                    structureType: STRUCTURE_RAMPART,
                    my: false
                }}]],
                output: true
            },
            {
                test: 'Any structure that represents a friendly rampart or road should not represent walls',
                input: [[
                    {type: 'structure', structure: {
                        structureType: STRUCTURE_RAMPART, my: true
                    }},
                    {type: 'structure', structure: {
                        structureType: STRUCTURE_ROAD
                    }}
                ]],
                output: false
            },
            {
                test: 'Just for some good measure',
                input: [[
                    {type: 'structure', structure: {
                        structureType: STRUCTURE_CONTROLLER
                    }},
                    {type: 'structure', structure: {
                        structureType: STRUCTURE_LINK
                    }}
                ]],
                output: true
            }
        ];

        var run = function(test) {
            return function() {
                assert.deepEqual(lib.hasWall(test.input[0], test.input[1]), test.output);
            };
        };

        for (var i = 0; i < tests.length; i++) {
            it(tests[i].test, run(tests[i]));
        }

        it('Should throw an error if an unvalid structure type has been detected', function() {
            var run = function() {
                lib.hasWall([{type: 'structure', structure: {
                    structureType: 'notExistingStructure'
                }}]);
            };

            var testUnknownStructureException = function(e) {
                return e instanceof Error &&
                    e.message === "Unknown structure type notExistingStructure";
            };

            assert.throws(run, testUnknownStructureException);
        });
    });
});