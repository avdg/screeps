'use strict';

function reset() {

    // It gets what it gets, otherwise it will digg to get it
    Room.prototype.get = function(type, options) {
        if (typeof AI.extensions.targets[type] === "object" &&
            typeof AI.extensions.targets[type].get === "function"
        ) return AI.extensions.targets[type].get(this, options);
    };

    AI.get = function(type, options) {
        if (typeof AI.extensions.targets[type] === "object" &&
            typeof AI.extensions.targets[type].get === "function"
        ) return AI.extensions.targets[type].get(undefined, options);
    };
}

module.exports = {
    resetApi: reset
};

reset();