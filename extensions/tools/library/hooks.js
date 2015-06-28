'use strict';

function emit(f) {
    var args = Array(arguments.length - 1);

    var i = 0;
    while (++i < arguments.length) {
        args[i - 1] = arguments[i];
    }

    for (var hook in AI.extensions.hooks) {
        if (typeof AI.extensions.hooks[hook][f] === "function") {
            AI.extensions.hooks[hook][f].apply(undefined, args);
        }
    }
}

module.exports = {
    emit: emit
};