'use strict';

function emit(f) {
    for (var hook in AI.extensions.hooks) {
        if (typeof AI.extensions.hooks[hook][f] === "function") {
            AI.extensions.hooks[hook][f]();
        }
    }
}

module.exports = {
    emit: emit
};