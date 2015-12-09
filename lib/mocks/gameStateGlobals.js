'use strict';

module.exports = function(reset) {
    global._ = require("lodash");

    global = _.merge(global, {
        FIND_EXIT_TOP: 1,
        FIND_EXIT_RIGHT: 3,
        FIND_EXIT_BOTTOM: 5,
        FIND_EXIT_LEFT: 7,
        FIND_EXIT: 10,
        FIND_CREEPS: 101,
        FIND_MY_CREEPS: 102,
        FIND_HOSTILE_CREEPS: 103,
        FIND_SOURCES_ACTIVE: 104,
        FIND_SOURCES: 105,
        FIND_DROPPED_ENERGY: 106,
        FIND_DROPPED_RESOURCES: 106,
        FIND_STRUCTURES: 107,
        FIND_MY_STRUCTURES: 108,
        FIND_HOSTILE_STRUCTURES: 109,
        FIND_FLAGS: 110,
        FIND_CONSTRUCTION_SITES: 111,
        FIND_MY_SPAWNS: 112,
        FIND_HOSTILE_SPAWNS: 113,
        FIND_MY_CONSTRUCTION_SITES: 114,
        FIND_HOSTILE_CONSTRUCTION_SITES: 115,

        TOP: 1,
        TOP_RIGHT: 2,
        RIGHT: 3,
        BOTTOM_RIGHT: 4,
        BOTTOM: 5,
        BOTTOM_LEFT: 6,
        LEFT: 7,
        TOP_LEFT: 8,

        OK: 0,
        ERR_NOT_OWNER: -1,
        ERR_NO_PATH: -2,
        ERR_NAME_EXISTS: -3,
        ERR_BUSY: -4,
        ERR_NOT_FOUND: -5,
        ERR_NOT_ENOUGH_ENERGY: -6,
        ERR_NOT_ENOUGH_RESOURCES: -6,
        ERR_INVALID_TARGET: -7,
        ERR_FULL: -8,
        ERR_NOT_IN_RANGE: -9,
        ERR_INVALID_ARGS: -10,
        ERR_TIRED: -11,
        ERR_NO_BODYPART: -12,
        ERR_NOT_ENOUGH_EXTENSIONS: -6,
        ERR_RCL_NOT_ENOUGH: -14,
        ERR_GCL_NOT_ENOUGH: -15,

        COLOR_RED: 'red',
        COLOR_PURPLE: 'purple',
        COLOR_BLUE: 'blue',
        COLOR_CYAN: 'cyan',
        COLOR_GREEN: 'green',
        COLOR_YELLOW: 'yellow',
        COLOR_ORANGE: 'orange',
        COLOR_BROWN: 'brown',
        COLOR_GREY: 'grey',
        COLOR_WHITE: 'white',

        CREEP_SPAWN_TIME: 3,
        CREEP_LIFE_TIME: 1500,

        OBSTACLE_OBJECT_TYPES: ['spawn', 'creep', 'wall', 'source', 'constructedWall', 'extension', 'link', 'storage', 'tower', 'observer', 'powerSpawn', 'powerBank'],

        ENERGY_REGEN_TIME: 300,
        ENERGY_REGEN_AMOUNT: 3000,
        ENERGY_DECAY: 1000,

        CREEP_CORPSE_RATE: 0.2,

        REPAIR_COST: 0.01,

        RAMPART_DECAY_AMOUNT: 300,
        RAMPART_DECAY_TIME: 100,
        RAMPART_HITS: 1,
        RAMPART_HITS_MAX: {
            2: 300000,
            3: 1000000,
            4: 3000000,
            5: 10000000,
            6: 30000000,
            7: 100000000,
            8: 300000000
        },

        SPAWN_HITS: 5000,
        SPAWN_ENERGY_START: 300,
        SPAWN_ENERGY_CAPACITY: 300,

        SOURCE_ENERGY_CAPACITY: 3000,

        ROAD_HITS: 5000,

        WALL_HITS: 1,
        WALL_HITS_MAX: 300000000,

        EXTENSION_HITS: 1000,
        EXTENSION_ENERGY_CAPACITY: {
            0: 50,
            1: 50,
            2: 50,
            3: 50,
            4: 50,
            5: 50,
            6: 50,
            7: 100,
            8: 200
        },

        ROAD_WEAROUT: 1,
        ROAD_DECAY_AMOUNT: 100,
        ROAD_DECAY_TIME: 1000,

        LINK_HITS: 1000,
        LINK_HITS_MAX: 1000,
        LINK_CAPACITY: 800,
        LINK_COOLDOWN: 1,
        LINK_LOSS_RATIO: 0.03,

        STORAGE_CAPACITY: 1000000,
        STORAGE_HITS: 10000,

        BODYPART_COST: {
            move: 50,
            work: 100,
            attack: 80,
            carry: 50,
            heal: 250,
            ranged_attack: 150,
            tough: 10
        },

        CARRY_CAPACITY: 50,
        HARVEST_POWER: 2,
        REPAIR_POWER: 100,
        BUILD_POWER: 5,
        ATTACK_POWER: 30,
        UPGRADE_CONTROLLER_POWER: 1,
        RANGED_ATTACK_POWER: 10,
        HEAL_POWER: 12,
        RANGED_HEAL_POWER: 4,

        MOVE: 'move',
        WORK: 'work',
        CARRY: 'carry',
        ATTACK: 'attack',
        RANGED_ATTACK: 'ranged_attack',
        TOUGH: 'tough',
        HEAL: 'heal',

        CONSTRUCTION_COST: {
            spawn: 15000,
            extension: 3000,
            road: 300,
            constructedWall: 1,
            rampart: 1,
            link: 5000,
            storage: 30000,
            tower: 5000,
            observer: 8000,
            powerSpawn: 100000
        },
        CONSTRUCTION_COST_ROAD_SWAMP_RATIO: 5,

        STRUCTURE_SPAWN: 'spawn',
        STRUCTURE_EXTENSION: 'extension',
        STRUCTURE_ROAD: 'road',
        STRUCTURE_WALL: 'constructedWall',
        STRUCTURE_RAMPART: 'rampart',
        STRUCTURE_KEEPER_LAIR: 'keeperLair',
        STRUCTURE_PORTAL: 'portal',
        STRUCTURE_CONTROLLER: 'controller',
        STRUCTURE_LINK: 'link',
        STRUCTURE_STORAGE: 'storage',
        STRUCTURE_TOWER: 'tower',
        STRUCTURE_OBSERVER: 'observer',
        STRUCTURE_POWER_BANK: 'powerBank',
        STRUCTURE_POWER_SPAWN: 'powerSpawn',

        CONTROLLER_LEVELS: {
            1: 200,
            2: 45000,
            3: 135000,
            4: 405000,
            5: 1215000,
            6: 3645000,
            7: 10935000
        },
        CONTROLLER_STRUCTURES: {
            spawn: {
                1: 1,
                2: 1,
                3: 1,
                4: 1,
                5: 1,
                6: 1,
                7: 2,
                8: 3
            },
            extension: {
                1: 0,
                2: 5,
                3: 10,
                4: 20,
                5: 30,
                6: 40,
                7: 50,
                8: 2500
            },
            link: {
                1: 0,
                2: 0,
                3: 0,
                4: 0,
                5: 2,
                6: 3,
                7: 4,
                8: 5
            },
            road: {
                1: 0,
                2: 0,
                3: 2500,
                4: 2500,
                5: 2500,
                6: 2500,
                7: 2500,
                8: 2500
            },
            constructedWall: {
                1: 0,
                2: 2500,
                3: 2500,
                4: 2500,
                5: 2500,
                6: 2500,
                7: 2500,
                8: 2500
            },
            rampart: {
                1: 0,
                2: 2500,
                3: 2500,
                4: 2500,
                5: 2500,
                6: 2500,
                7: 2500,
                8: 2500
            },
            storage: {
                1: 0,
                2: 0,
                3: 0,
                4: 1,
                5: 1,
                6: 1,
                7: 1,
                8: 1
            },
            tower: {
                1: 0,
                2: 0,
                3: 1,
                4: 1,
                5: 1,
                6: 2,
                7: 2,
                8: 4
            },
            observer: {
                1: 0,
                2: 0,
                3: 0,
                4: 0,
                5: 0,
                6: 0,
                7: 0,
                8: 1
            },
            powerSpawn: {
                1: 0,
                2: 0,
                3: 0,
                4: 0,
                5: 0,
                6: 0,
                7: 0,
                8: 1
            }
        },
        CONTROLLER_DOWNGRADE: {
            1: 20000,
            2: 50000,
            3: 50000,
            4: 50000,
            5: 50000,
            6: 50000,
            7: 50000
        },
        CONTROLLER_RESERVE: 6,
        CONTROLLER_RESERVE_MAX: 5000,
        CONTROLLER_RESERVE_COST: 1,
        CONTROLLER_MAX_UPGRADE_PER_TICK: 15,

        TOWER_HITS: 3000,
        TOWER_CAPACITY: 1000,
        TOWER_ENERGY_COST: 10,
        TOWER_POWER_ATTACK: 600,
        TOWER_POWER_HEAL: 400,
        TOWER_POWER_REPAIR: 600,
        TOWER_OPTIMAL_RANGE: 10,
        TOWER_FALLOF_RANGE: 40,
        TOWER_FALLOF: 0.5,

        OBSERVER_HITS: 500,
        OBSERVER_RANGE: 5,

        POWER_BANK_HITS: 2000000,
        POWER_BANK_CAPACITY_MAX: 5000,
        POWER_BANK_CAPACITY_MIN: 500,
        POWER_BANK_CAPACITY_CRIT: 0.3,
        POWER_BANK_DECAY: 5000,
        POWER_BANK_HIT_BACK: 0.5,

        POWER_SPAWN_HITS: 5000,
        POWER_SPAWN_ENERGY_CAPACITY: 5000,
        POWER_SPAWN_POWER_CAPACITY: 100,
        POWER_SPAWN_ENERGY_RATIO: 50,

        GCL_POW: 2.4,
        GCL_MULTIPLY: 1000000,

        MODE_SIMULATION: 'simulation',
        MODE_SURVIVAL: 'survival',
        MODE_WORLD: 'world',
        MODE_ARENA: 'arena',

        TERRAIN_MASK_WALL: 1,
        TERRAIN_MASK_SWAMP: 2,
        TERRAIN_MASK_LAVA: 4,

        MAX_CONSTRUCTION_SITES: 100,
        MAX_CREEP_SIZE: 50,

        RESOURCE_ENERGY: 'energy',
        RESOURCE_POWER: 'power'
    });
    global.BODYPARTS_ALL = [MOVE, WORK, CARRY, ATTACK, RANGED_ATTACK, TOUGH, HEAL];

    global.Game = {
        "creeps": {},
        "flags": {},
        "rooms": {},
        "spawns": {},
        "structures": {},
        "cpuLimit": Infinity
    };

    if (reset === true || typeof global.Memory !== "object") {
        global.Memory = {
            "creeps": {},
            "spawns": {},
            "rooms": {}
        };
    }

    global.ConstructionSite = function() {};
    global.Creep = function() {};
    global.Energy = function() {};
    global.Flag = function() {};
    global.Map = function() {};
    global.Room = function(name) {
        this.name = name;
    };
    global.RoomPosition = function(x, y, roomName) {
        this.x = x;
        this.y = y;
        this.roomName = roomName;
    };
    global.Source = function() {};
    global.Spawn = function() {};
    global.Structure = function() {};
    require('./screeps/Game.js');
};