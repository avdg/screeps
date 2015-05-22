'use strict';

function hookIterator(f) {
    for (var hook in AI.extensions.hooks) {
        if (typeof AI.extensions.hooks[hook][f] === "function") {
            AI.extensions.hooks[hook][f]();
        }
    }
}

function pre() {
    if (AI.isFirstTurn()) {
        hookIterator("firstTurn");
    }

    hookIterator("preController");
}

function post() {
    hookIterator("postController");
}

module.exports = {
    pre: pre,
    post: post,
};
