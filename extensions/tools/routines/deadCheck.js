'use strict';

function deadCheckRoutine(creep, options) {
    if (creep.ticksToLive === 1) {
        creep.drop(RESOURCE_ENERGY);
        creep.drop(RESOURCE_POWER);
        return true;
    } else if (creep.ticksToLive === 2) {
        creep.say("Bye bye!");
    }

    return false;
}

module.exports = {
    routine: deadCheckRoutine
};