'use strict';

// Based on https://github.com/patrick-steele-idem/app-module-path-node/blob/a8fcd943650815060f4f1a06071d33e5a67e7824/lib/index.js
// Licensed under BSD-2-Clause
var Module = require('module').Module;
var path = require('path');
var appModulePaths = [path.join(__dirname, '../../build/deploy/')];
var old_nodeModulePaths = Module._nodeModulePaths;

Module._nodeModulePaths = function(from) {
    var paths = old_nodeModulePaths.call(this, from);

    // Only include the app module path for top-level modules
    // that were not installed:
    if (from.indexOf('node_modules') === -1) {
        paths = appModulePaths.concat(paths);
    }

    return paths;
};
// End snippet

function run(_state) {
    require('../mocks/gameStateGlobals')();
    require('../../build/deploy/main.js');
}

run();