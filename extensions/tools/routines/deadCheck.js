'use strict';

function deadCheckRoutine(creep, options) {
    if (creep.ticksToLive === 1) {
        creep.dropEnergy();
        return true;
    } else if (creep.ticksToLive === 2) {
        creep.say("Bye bye!");
    }

    return false;
}

module.exports = {
    routine: deadCheckRoutine
};