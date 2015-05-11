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
        code += "var exec = module.exports = function(){\n    AI = {};\n    for (var i in generated) {generated[i]();}\n};\nexec();";
    }

    return code;
};

module.exports = {
    generate: generate
};