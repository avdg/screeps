'use strict';

module.exports = function() {
    var _ = require("lodash");

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
        FIND_STRUCTURES: 107,
        FIND_MY_STRUCTURES: 108,
        FIND_HOSTILE_STRUCTURES: 109,
        FIND_FLAGS: 110,
        FIND_CONSTRUCTION_SITES: 111,
        FIND_MY_SPAWNS: 112,
        FIND_HOSTILE_SPAWNS: 113,
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
        ERR_INVALID_TARGET: -7,
        ERR_FULL: -8,
        ERR_NOT_IN_RANGE: -9,
        ERR_INVALID_ARGS: -10,
        ERR_TIRED: -11,
        ERR_NO_BODYPART: -12,
        ERR_NOT_ENOUGH_EXTENSIONS: -13,
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
        CREEP_LIFE_TIME: 1800,
        OBSTACLE_OBJECT_TYPES: ['spawn', 'creep', 'wall', 'source', 'constructedWall', 'extension'],
        ENERGY_REGEN_TIME: 300,
        ENERGY_REGEN_AMOUNT: 3000,
        ENERGY_DECAY: 1,
        CREEP_CORPSE_RATE: 0.2,
        REPAIR_COST: 0.1,
        RAMPART_DECAY_AMOUNT: 1,
        RAMPART_DECAY_TIME: 30,
        RAMPART_HITS: 1000,
        SPAWN_HITS: 5000,
        SPAWN_ENERGY_START: 1000,
        SPAWN_ENERGY_CAPACITY: 6000,
        SOURCE_ENERGY_CAPACITY: 3000,
        ROAD_HITS: 300,
        WALL_HITS: 6000,
        EXTENSION_HITS: 1000,
        EXTENSION_ENERGY_CAPACITY: 200,
        EXTENSION_ENERGY_COST: 200,
        ROAD_WEAROUT: 1,
        BODYPART_COST: {
            move: 50,
            work: 20,
            attack: 80,
            carry: 50,
            heal: 200,
            ranged_attack: 150,
            tough: 20
        },
        CARRY_CAPACITY: 50,
        HARVEST_POWER: 2,
        REPAIR_POWER: 20,
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
            spawn: 5000,
            extension: 3000,
            road: 300,
            constructedWall: 500,
            rampart: 2000
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
        CONTROLLER_LEVELS: {
            1: 30000,
            2: 90000,
            3: 270000,
            4: 810000,
            5: 2430000,
            6: 7290000,
            7: 2187000
        },
        CONTROLLER_SPAWNS: {
            1: 1,
            2: 1,
            3: 1,
            4: 1,
            5: 1,
            6: 1,
            7: 2,
            8: 3
        },
        CONTROLLER_EXTENSIONS: {
            2: 3,
            3: 6,
            4: 10,
            5: 13,
            6: 16,
            7: 20,
            8: 25
        },
        GCL_POW: 2.2,
        GCL_MULTIPLY: 2000000,
        MODE_SIMULATION: 'simulation',
        MODE_SURVIVAL: 'survival',
        MODE_WORLD: 'world',
        MODE_ARENA: 'arena',
        TERRAIN_MASK_WALL: 1,
        TERRAIN_MASK_SWAMP: 2,
        TERRAIN_MASK_LAVA: 4
    });
    global.BODYPARTS_ALL = [MOVE, WORK, CARRY, ATTACK, RANGED_ATTACK, TOUGH, HEAL];

    global.Game = {
        "creeps": {},
        "flags": {},
        "rooms": {},
        "spawns": {},
        "structures": {},
    };

    global.Memory = {
        "creeps": {},
        "spawns": {},
        "rooms": {}
    };

    global.Creep = function() {};
    global.Energy = function() {};
    global.Flag = function() {};
    global.Map = function() {};
    global.Room = function() {};
    global.RoomPosition = function() {};
    global.Source = function() {};
    global.Spawn = function() {};
    global.Structure = function() {};
};