'use strict';

var defaultGenerators = {
    extensions: {
        generate: require('./extensions').parse
    },
    globals: {
        generate: require('./globals').generate
    }
};

var generate = function(options, generators) {
    if (options === undefined) {
        options = {};
    }

    if (generators === undefined) {
        generators = defaultGenerators;
    }

    var code = "'use strict';\n\n";

    // Iterate through code generators
    if (typeof generators === "object" && Object.keys(generators).length > 0) {

        // Put code in array
        code += "var generated = {\n";

        var results = [];
        for (var i in generators) {
            results.push(i + ': ' + generators[i].generate(options));
        }
        code += results.join(",\n") + "\n";

        code += "};\n\n";

        // Create function
        code +=
            "var exec = module.exports = function(){\n" +
            "    if (typeof global === 'undefined') AI = {}; else global.AI = {};\n" +
            "    var run = [];\n" +
            "    for (var i in generated) {var result = generated[i](); if (typeof result === 'function') { run.push(result); } }\n" +
            "    for (var j in run) { run[j](); }\n" +
            "};\n" +
            "exec();";
    }

    return code;
};

module.exports = {
    generate: generate
};