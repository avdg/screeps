"use strict";

var assert = require("assert");

var simple = require("simple-mock");

function reset() {
    require("../../../../lib/mocks/gameStateGlobals")();

    global.AI = {
        extensions: {
            targets: {}
        }
    };
}
reset();

var lib = require("../../../../extensions/tools/library/api");

describe("Library extension: api", function() {
    beforeEach(reset);

    describe("Creep.prototype.do", function() {
        it("Should be able to execute the given routine", function() {
            AI.extensions.routines = {
                test: {
                    routine: function() {
                        return true;
                    }
                }
            };

            lib.reset();
            var fn = simple.mock(AI.extensions.routines.test, "routine");

            var creep = new Creep();
            assert.strictEqual(creep.do("test", {}), true);

            assert.equal(fn.callCount, 1);
            assert.deepEqual(fn.lastCall.args, [creep, {}]);
        });

        it("Should give error if the routine doesn't exist", function() {
            AI.extensions.routines = {};

            var f = function() {
                lib.reset();
                var creep = new Creep();
                creep.do("thisDoesntExist");
            };
            var validator = function(e) {
                return e instanceof Error &&
                    e.message === "Cannot find routine thisDoesntExist";
            };

            assert.throws(f, validator);
        });

        it("Should give error if the routine is not a function", function() {
            AI.extensions.routines = {
                notAFunction: {
                    routine: "test"
                }
            };

            var f = function() {
                lib.reset();
                var creep = new Creep();
                creep.do("notAFunction");
            };
            var validator = function(e) {
                return e instanceof Error &&
                    e.message === "Cannot find routine notAFunction";
            };

            assert.throws(f, validator);
        });
    });

    describe("Room.prototype.get", function() {
        it("Should be able to call the target getter", function() {
            AI.extensions.targets.testTarget = {
                get: function() {}
            };

            lib.reset();
            var fn = simple.mock(AI.extensions.targets.testTarget, "get");

            var room = new Room("test");
            room.get("testTarget");

            assert.equal(fn.callCount, 1);
        });
    });

    describe("Room.prototype.getExtensionEnergy", function() {
        var defaultFilter = function() {
            return true;
        };

        var resetRoomLibrary = function() {
            lib.reset();
            lib.test.reset();
        };

        beforeEach(resetRoomLibrary);

        it("Should be able to calculate how much energy in extensions a room has", function() {
            var extension1 = new Structure();
            extension1.structureType = STRUCTURE_EXTENSION;
            extension1.energy = 35;
            extension1.energyCapacity = 50;

            var extension2 = new Structure();
            extension2.structureType = STRUCTURE_EXTENSION;
            extension2.energy = 21;
            extension2.energyCapacity = 50;

            Game.rooms.test = new Room("test");
            Game.rooms.test.find = function(type, options) {
                assert.strictEqual(type, FIND_MY_STRUCTURES);
                options = options || {};

                return [extension1, extension2].filter(options.filter || defaultFilter);
            };

            var fn1 = simple.mock(Game.rooms.test, "find");

            assert.strictEqual(Game.rooms.test.getExtensionEnergy(), 56);
            assert.strictEqual(fn1.callCount, 1);
        });
    });

    describe("RoomPosition.prototype.countEmptyTilesAround", function() {
        beforeEach(function() {
            lib.reset();
            AI.hasWall = require("../../../../extensions/tools/library/room").hasWall;
        });

        it("Should count tiles around a given position (1)", function() {
            Game.rooms.test = {};

            var fn1 = simple.mock(Game.rooms.test, "lookAtArea").returnWith({
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

            var pos = new RoomPosition(3, 8, "test");

            assert.equal(8, pos.countEmptyTilesAround());
        });

        it("Should count tiles around a given position (2)", function() {
            Game.rooms.test = {};

            var fn = simple.mock(Game.rooms.test, "lookAtArea").returnWith({
                7: {
                    2: [],
                    3: [{type: "terrain", terrain: "wall"}],
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

            var pos = new RoomPosition(3, 8, "test");

            assert.equal(pos.countEmptyTilesAround(), 7);
            assert.equal(fn.callCount, 1);
        });

        it("Should return undefined when a an edge position is given", function() {
            assert.strictEqual((new RoomPosition(-1, 3, "test")).countEmptyTilesAround(), undefined);
            assert.strictEqual((new RoomPosition(50, 3, "test")).countEmptyTilesAround(), undefined);
            assert.strictEqual((new RoomPosition(0, -1, "test")).countEmptyTilesAround(), undefined);
            assert.strictEqual((new RoomPosition(0, 50, "test")).countEmptyTilesAround(), undefined);
        });

        it("Should return 3 if there are no walls and position is a corner", function() {
            Game.rooms.test = {};

            var fn = simple.mock(Game.rooms.test, "lookAtArea").returnWith({
                0: {
                    0: [],
                    1: []
                },
                1: {
                    0: [],
                    1: []
                }
            });

            var pos = new RoomPosition(0, 0, "test");

            assert.equal(pos.countEmptyTilesAround(), 3);
            assert.equal(fn.callCount, 1);
        });

        it("Should return 3 if there are no walls and position is a corner (2)", function() {
            Game.rooms.test = {};

            var fn = simple.mock(Game.rooms.test, "lookAtArea").returnWith({
                48: {
                    48: [],
                    49: []
                },
                49: {
                    48: [],
                    49: []
                }
            });

            var pos = new RoomPosition(49, 49, "test");

            assert.equal(pos.countEmptyTilesAround(), 3);
            assert.equal(fn.callCount, 1);
        });
    });

    describe("Spawn.prototype.getAvailableEnergy", function() {
        var defaultFilter = function() {
            return true;
        };

        var resetRoomLibrary = function() {
            lib.reset();
            lib.test.reset();
        };

        beforeEach(resetRoomLibrary);

        it("Should be able to calculate how much energy a certain spawn has", function() {
            var extension1 = new Structure();
            extension1.structureType = STRUCTURE_EXTENSION;
            extension1.energy = 35;
            extension1.energyCapacity = 50;

            var extension2 = new Structure();
            extension2.structureType = STRUCTURE_EXTENSION;
            extension2.energy = 21;
            extension2.energyCapacity = 50;

            Game.spawns = {
                Spawn1: new Spawn()
            };

            Game.rooms.test = new Room("test");
            Game.rooms.test.find = function(type, options) {
                assert.strictEqual(type, FIND_MY_STRUCTURES);
                options = options || {};

                return [extension1, extension2].filter(options.filter || defaultFilter);
            };

            Game.spawns.Spawn1.name = "Spawn1";
            Game.spawns.Spawn1.room = Game.rooms.test;
            Game.spawns.Spawn1.energy = 137;
            Game.spawns.Spawn1.energyCapacity = 500;

            var fn1 = simple.mock(Game.rooms.test, "find");

            assert.strictEqual(Game.spawns.Spawn1.getAvailableEnergy(), 193);
            assert.strictEqual(fn1.callCount, 1);
        });

        it("Should be able to share energy between spawns in the same room", function() {
            var extension1 = new Structure();
            extension1.structureType = STRUCTURE_EXTENSION;
            extension1.energy = 36;
            extension1.energyCapacity = 50;

            var extension2 = new Structure();
            extension2.structureType = STRUCTURE_EXTENSION;
            extension2.energy = 38;
            extension2.energyCapacity = 50;

            Game.spawns = {
                Spawn1: new Spawn(),
                Spawn2: new Spawn()
            };

            Game.rooms.test = new Room("test");
            Game.rooms.test.find = function(type, options) {
                assert.strictEqual(type, FIND_MY_STRUCTURES);
                options = options || {};

                return [extension1, extension2].filter(options.filter || defaultFilter);
            };

            Game.spawns.Spawn1.name = "Spawn1";
            Game.spawns.Spawn1.room = Game.rooms.test;
            Game.spawns.Spawn1.energy = 318;
            Game.spawns.Spawn1.energyCapacity = 500;

            Game.spawns.Spawn2.name = "Spawn2";
            Game.spawns.Spawn2.room = Game.rooms.test;
            Game.spawns.Spawn2.energy = 418;
            Game.spawns.Spawn2.energyCapacity = 500;

            var fn1 = simple.mock(Game.rooms.test, "find");

            assert.strictEqual(Game.spawns.Spawn1.getAvailableEnergy(), 392);
            assert.strictEqual(Game.spawns.Spawn2.getAvailableEnergy(), 492);
            assert.strictEqual(fn1.callCount, 1);
        });
    });

    describe("Spawn.prototype.subtractEnergy", function() {
        var defaultFilter = function() {
            return true;
        };

        var resetRoomLibrary = function() {
            lib.reset();
            lib.test.reset();
        };

        beforeEach(resetRoomLibrary);

        it("Should be able to subtract energy from a spawn", function() {
            var extension1 = new Structure();
            extension1.structureType = STRUCTURE_EXTENSION;
            extension1.energy = 50;
            extension1.energyCapacity = 50;

            var extension2 = new Structure();
            extension2.structureType = STRUCTURE_EXTENSION;
            extension2.energy = 47;
            extension2.energyCapacity = 50;

            var extension3 = new Structure();
            extension3.structureType = STRUCTURE_EXTENSION;
            extension3.energy = 0;
            extension3.energyCapcity = 50;

            Game.spawns = {
                Spawn1: new Spawn()
            };

            Game.rooms.test = new Room("test");
            Game.rooms.test.find = function(type, options) {
                assert.strictEqual(type, FIND_MY_STRUCTURES);
                options = options || {};

                return [extension1, extension2, extension3].filter(options.filter || defaultFilter);
            };

            Game.spawns.Spawn1.name = "Spawn1";
            Game.spawns.Spawn1.room = Game.rooms.test;
            Game.spawns.Spawn1.energy = 500;
            Game.spawns.Spawn1.energyCapcaity = 500;

            var fn1 = simple.mock(Game.rooms.test, "find");

            assert.strictEqual(Game.spawns.Spawn1.getAvailableEnergy(), 597);
            assert.strictEqual(Game.rooms.test.getExtensionEnergy(), 97);

            assert.strictEqual(Game.spawns.Spawn1.subtractEnergy(553), true);
            assert.strictEqual(Game.spawns.Spawn1.getAvailableEnergy(), 44);
            assert.strictEqual(Game.rooms.test.getExtensionEnergy(), 44);

            assert.strictEqual(fn1.callCount, 1);
        });

        it("Should not be able to subtract energy if there is not enough energy to subtract", function() {
            var extension1 = new Structure();
            extension1.structureType = STRUCTURE_EXTENSION;
            extension1.energy = 37;
            extension1.energyCapacity = 50;

            var extension2 = new Structure();
            extension2.structureType = STRUCTURE_EXTENSION;
            extension2.energy = 25;
            extension2.energyCapacity = 50;

            Game.spawns = {
                Spawn1: new Spawn()
            };

            Game.rooms.test = new Room("test");
            Game.rooms.test.find = function(type, options) {
                assert.strictEqual(type, FIND_MY_STRUCTURES);
                options = options || {};

                return [extension1, extension2].filter(options.filter || defaultFilter);
            };

            Game.spawns.Spawn1.name = "Spawn1";
            Game.spawns.Spawn1.room = Game.rooms.test;
            Game.spawns.Spawn1.energy = 500;
            Game.spawns.Spawn1.energyCapcaity = 500;

            var fn1 = simple.mock(Game.rooms.test, "find");

            assert.strictEqual(Game.spawns.Spawn1.getAvailableEnergy(), 562);
            assert.strictEqual(Game.rooms.test.getExtensionEnergy(), 62);

            assert.strictEqual(Game.spawns.Spawn1.subtractEnergy(570), false);
            assert.strictEqual(Game.spawns.Spawn1.getAvailableEnergy(), 562);
            assert.strictEqual(Game.rooms.test.getExtensionEnergy(), 62);
            assert.strictEqual(fn1.callCount, 1);
        });

        it("Should not subtract energy from extensions if the spawn has enough energy", function() {
            var extension1 = new Structure();
            extension1.structureType = STRUCTURE_EXTENSION;
            extension1.energy = 37;
            extension1.energyCapacity = 50;

            var extension2 = new Structure();
            extension2.structureType = STRUCTURE_EXTENSION;
            extension2.energy = 25;
            extension2.energyCapacity = 50;

            Game.spawns = {
                Spawn1: new Spawn()
            };

            Game.rooms.test = new Room("test");
            Game.rooms.test.find = function(type, options) {
                assert.strictEqual(type, FIND_MY_STRUCTURES);
                options = options || {};

                return [extension1, extension2].filter(options.filter || defaultFilter);
            };

            Game.spawns.Spawn1.name = "Spawn1";
            Game.spawns.Spawn1.room = Game.rooms.test;
            Game.spawns.Spawn1.energy = 500;
            Game.spawns.Spawn1.energyCapcaity = 500;

            var fn1 = simple.mock(Game.rooms.test, "find");

            assert.strictEqual(Game.spawns.Spawn1.getAvailableEnergy(), 562);
            assert.strictEqual(Game.rooms.test.getExtensionEnergy(), 62);

            assert.strictEqual(Game.spawns.Spawn1.subtractEnergy(499), true);
            assert.strictEqual(Game.spawns.Spawn1.getAvailableEnergy(), 63);
            assert.strictEqual(Game.rooms.test.getExtensionEnergy(), 62);
            assert.strictEqual(fn1.callCount, 1);

        });

        it("Should update available energy from other spawns if they are infected", function() {
            var extension1 = new Structure();
            extension1.structureType = STRUCTURE_EXTENSION;
            extension1.energy = 36;
            extension1.energyCapacity = 50;

            var extension2 = new Structure();
            extension2.structureType = STRUCTURE_EXTENSION;
            extension2.energy = 38;
            extension2.energyCapacity = 50;

            var extension3 = new Structure();
            extension3.structureType = STRUCTURE_EXTENSION;
            extension3.energy = 14;
            extension3.energyCapacity = 50;

            Game.spawns = {
                Spawn1: new Spawn(),
                Spawn2: new Spawn()
            };

            Game.rooms.test = new Room("test");
            Game.rooms.test.find = function(type, options) {
                assert.strictEqual(type, FIND_MY_STRUCTURES);
                options = options || {};

                return [extension1, extension2, extension3].filter(options.filter || defaultFilter);
            };

            Game.spawns.Spawn1.name = "Spawn1";
            Game.spawns.Spawn1.room = Game.rooms.test;
            Game.spawns.Spawn1.energy = 318;
            Game.spawns.Spawn1.energyCapacity = 500;

            Game.spawns.Spawn2.name = "Spawn2";
            Game.spawns.Spawn2.room = Game.rooms.test;
            Game.spawns.Spawn2.energy = 356;
            Game.spawns.Spawn2.energyCapacity = 500;

            var fn1 = simple.mock(Game.rooms.test, "find");

            assert.strictEqual(Game.spawns.Spawn1.getAvailableEnergy(), 406);
            assert.strictEqual(Game.spawns.Spawn2.getAvailableEnergy(), 444);
            assert.strictEqual(Game.rooms.test.getExtensionEnergy(), 88);

            assert.strictEqual(Game.spawns.Spawn2.subtractEnergy(367), true);
            assert.strictEqual(Game.spawns.Spawn1.getAvailableEnergy(), 395);
            assert.strictEqual(Game.spawns.Spawn2.getAvailableEnergy(), 77);
            assert.strictEqual(Game.rooms.test.getExtensionEnergy(), 77);
            assert.strictEqual(fn1.callCount, 1);
        });
    });

    describe("AI.get", function() {
        it("Should be able to call the target getter", function() {
            AI.extensions.targets.anotherTarget = {
                get: function() {}
            };

            lib.reset();
            var fn = simple.mock(AI.extensions.targets.anotherTarget, "get");

            AI.get("anotherTarget");

            assert.equal(fn.callCount, 1);
        });
    });
});