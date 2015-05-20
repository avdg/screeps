'use strict';

function unitIterator(f) {
    for (var hook in AI.extensions.hooks) {
        if (typeof AI.extensions.hooks[hook][f] === "function") {
            AI.extensions.hooks[hook][f]();
        }
    }
}

function pre() {
    if (AI.isFirstTurn()) {
        unitIterator("firstTurn");
    }

    unitIterator("preController");
}

function post() {
    unitIterator("postController");
}

module.exports = {
    pre: pre,
    post: post,
};
