'use strict';

function emit(f) {
    var args = new Array(arguments.length - 1);
    var results = [];

    var i = 0;
    while (++i < arguments.length) {
        args[i - 1] = arguments[i];
    }

    for (var hook in AI.extensions.hooks) {
        if (typeof AI.extensions.hooks[hook][f] === "function") {
            results.push(AI.extensions.hooks[hook][f].apply(undefined, args));
        }
    }

    return results;
}

module.exports = {
    emit: emit
};