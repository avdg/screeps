'use strict';

/**
 * Get the cost for building a creep
 */
var getCreepCost = function(parts) {
    var cost = 0;

    for (var i = 0; i < parts.length; i++) {
        if (parts[i] in BODYPART_COST) {
            cost += BODYPART_COST[parts[i]];
        }
        else {
            return -1;
        }
    }

    return cost;
};

module.exports = {
    getCreepCost: getCreepCost
};