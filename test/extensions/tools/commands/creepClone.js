'use strict';

var assert = require('assert');

var _ = require('lodash');
var simple = require('simple-mock');

var lib = _.merge(
    require('../../../../extensions/tools/library/commands'),
    require('../../../../extensions/tools/library/utils')
);
var hookFlags = require('../../../../extensions/tools/hooks/flags');

var commandCreepClone = require('../../../../extensions/tools/commands/creepClone');

function reset() {
    global.AI = {
        extensions: {
            commands: {
                creepClone: commandCreepClone
            }
        },
        parseCommand: lib.parseCommand
    };
    global.Game = {
        spawns: {}
    };
    global.Spawn = function(){};
    global._ = require("lodash");
}

describe('Tool extensions: Command creepClone', function() {
    beforeEach(reset);

    it('Should give error when not given enough parameters', function() {
        var flag = {
            name: 'creepClone',
            remove: function() {}
        };

        var fn = simple.mock(flag, 'remove');
        var buffer = [];

        lib.bufferConsole(
            function() { hookFlags.test.parseFlag(flag); },
            buffer
        );

        assert.equal(fn.callCount, 1);
        assert.deepEqual([['Flag command creepClone: creepClone command has not enough parameters']], buffer);
    });

    it('Should give error when an invalid creep is given', function() {
        Game = {
            creeps : {
                unexisting : undefined
            }
        };

        var flag = {
            name: 'creepClone unexisting',
            remove: function() {}
        };

        var fn = simple.mock(flag, 'remove');
        var buffer = [];

        lib.bufferConsole(
            function() { hookFlags.test.parseFlag(flag); },
            buffer
        );

        assert.equal(fn.callCount, 1);
        assert.deepEqual([['Flag command creepClone: Creep unexisting not found']], buffer);
    });

    it('Should be able to copy a creep into the spawn queue', function() {
        Game = {
            creeps: {
                'me!': {
                    memory: {
                        role: 'something!',
                        test: 'Blaaah!'
                    },
                    name: "me!"
                }
            }
        };

        Memory = {
            spawnQueue: ['Meh!']
        };

        var flag = {
            name: 'creepClone me!',
            remove: function() {}
        };

        var fn = simple.mock(flag, 'remove');
        var buffer = [];

        lib.bufferConsole(
            function() { hookFlags.test.parseFlag(flag); },
            buffer
        );

        assert.equal(fn.callCount, 1);
        assert.deepEqual(Memory.spawnQueue, ['Meh!', {
            role: 'something!',
            memory: {
                role: 'something!',
                test: 'Blaaah!'
            }
        }]);
        assert.deepEqual([['Added me! to global spawnQueue']], buffer);
    });

    it ('Should be able to copy a creep into a queue of a specific spawn', function() {
        Game = {
            creeps: {
                'guard 007': {
                    memory: {
                        role: 'guard',
                        spawn: '007SpawnId'
                    },
                    name: 'guard 007'
                }
            },
            getObjectById: function() {},
            spawns: {
                "007Spawn": new Spawn()
            }
        };

        Memory = {
            spawns: {}
        };

        Game.spawns["007Spawn"].name = "007Spawn";

        var flag = {
            name: 'creepClone "guard 007"',
            remove: function() {}
        };

        var fn = simple.mock(flag, 'remove');
        var fnGetObject = simple.mock(Game, 'getObjectById').returnWith(Game.spawns["007Spawn"]);
        var buffer = [];

        lib.bufferConsole(
            function () { hookFlags.test.parseFlag(flag); },
            buffer
        );

        assert.equal(fn.callCount, 1);
        assert.equal(fnGetObject.callCount, 1);
        assert.deepEqual(fnGetObject.lastCall.args, ["007SpawnId"]);
        assert.deepEqual(Memory.spawns["007Spawn"].spawnQueue, [
            {
                memory: {
                    role: 'guard',
                    spawn: '007SpawnId'
                },
                role: 'guard'
            }
        ]);
        assert.deepEqual([["Added guard 007 to spawnQueue at spawn 007Spawn"]], buffer);
    });

    it('Should be able to put a copy of a creep in priorityQueue', function() {
        Game = {
            creeps: {
                'me!': {
                    memory: {
                        role: 'something!',
                        test: 'Blaaah!'
                    },
                    name: "me!"
                }
            }
        };

        Memory = {
            spawnPriorityQueue: ['Meh!']
        };

        var flag = {
            name: 'creepClone me! true',
            remove: function() {}
        };

        var fn = simple.mock(flag, 'remove');
        var buffer = [];

        lib.bufferConsole(
            function() { hookFlags.test.parseFlag(flag); },
            buffer
        );

        assert.equal(fn.callCount, 1);
        assert.deepEqual(Memory.spawnPriorityQueue, ['Meh!', {
            role: 'something!',
            memory: {
                role: 'something!',
                test: 'Blaaah!'
            }
        }]);
        assert.deepEqual([['Added me! to global spawnPriorityQueue']], buffer);
    });

    it('Should be able to call the native function', function() {
        var creep = {
            memory: {
                role: 'medic'
            },
            name: 'blah'
        };

        Memory = {
            spawnQueue: []
        };
        var buffer = [];

        lib.bufferConsole(
            function() { lib.exec('creepClone', creep); },
            buffer
        );

        assert.deepEqual(Memory.spawnQueue, [{
            memory: {
                role: 'medic'
            },
            role: 'medic'
        }]);
        assert.deepEqual(buffer, [["Added blah to global spawnQueue"]]);
    });

    it('Should be able to silence output when calling the native function', function() {
        var creep = {
            memory: {
                role: 'medic'
            },
            name: 'blah'
        };

        Memory = {
            spawnQueue: []
        };
        var buffer = [];

        lib.bufferConsole(
            function() { lib.exec('creepClone', creep, false, true); },
            buffer
        );

        assert.deepEqual(Memory.spawnQueue, [{
            memory: {
                role: 'medic'
            },
            role: 'medic'
        }]);
        assert.deepEqual(buffer, []);
    });

    it('Should be able to copy a creep object without name into the spawn queue', function() {
        var creep = {
            memory: {
                role: 'medic'
            }
        };

        Memory = {
            spawnQueue: []
        };
        var buffer = [];

        lib.bufferConsole(
            function() { lib.exec('creepClone', creep); },
            buffer
        );

        assert.deepEqual(Memory.spawnQueue, [{
            memory: {
                role: 'medic'
            },
            role: 'medic'
        }]);
        assert.deepEqual(buffer, [["Added medic to global spawnQueue"]]);
    });

    it('Should be able to copy a creep object without name into a specific spawn queue', function() {
        var creep = {
            memory: {
                role: 'medic',
                spawn: 'homeSpawnId'
            }
        };

        Game = {
            spawns: {
                home: new Spawn()
            }
        };
        Game.spawns.home.name = "home";

        Memory = {
            spawns: {}
        };
        var buffer = [];

        var fn = simple.mock(Game, 'getObjectById').returnWith(Game.spawns.home);

        lib.bufferConsole(
            function() { lib.exec('creepClone', creep); },
            buffer
        );

        assert.deepEqual(Memory.spawns.home.spawnQueue, [{
            memory: {
                role: 'medic',
                spawn: 'homeSpawnId'
            },
            role: 'medic'
        }]);
        assert.deepEqual(buffer, [["Added medic to spawnQueue at spawn home"]]);
        assert.equal(fn.callCount, 1);
        assert.deepEqual(fn.lastCall.args, ['homeSpawnId']);
    });
});