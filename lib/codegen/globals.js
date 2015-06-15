'use strict';

var _ = require('lodash');

// This script returns code to the generator that adds
// variables to the main object
var generate = function(options) {
    if (options === undefined || typeof options !== "object") {
        options = {};
    }

    if (typeof options.globalModules === "string") {
        options.globalModules = [options.globalModules];
    }

    if (!Array.isArray(options.globalModules)) {
        options.globalModules = ['_settings'];
    }

    var code = "function() {\n    var _ = require('lodash');\n\n";

    for (var i = 0; i < options.globalModules.length; i++) {
        code += "    _.merge(AI, require('" + options.globalModules[i] + "'));\n";
    }

    code += "}";

    return code;
};

module.exports = {
    generate: generate
};