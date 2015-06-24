'use strict';

var settings = {
    'roundTimeLimit': 75,
    'spawnQueue': ['FOO'],
    'spawnPriorityQueue': [],
    'statusFrequency': 100,

    // Unit settings
    'deathChecker': {
        'ignore': ['FOO'],
        'copy': [],
        'copyPriority': [],
    },

    // Statistics
    'noStats': true,
};

module.exports = {
    settings: settings
};