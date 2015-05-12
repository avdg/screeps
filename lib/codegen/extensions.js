'use strict';

var _ = require("lodash");
var fs = require("fs");
var path = require("path");

function check(extensions, origins, prefix) {
    var result = merge(extensions);
    var errors = [];
    var dummy = [];

    var handler = function(content, path) {
        var i, j;
        // Copy object and reference
        var sources = _.clone(origins);
        var objects = [];

        for (i = 0; i < extensions.length; i++) {
            objects.push(extensions[i]);
        }

        // Remove objects without path to content
        for (i = 0; i < (path.length - 1); i++) {
            // Count down to avoid conflict when removing
            for (j = objects.length - 1; j >= 0; j--) {
                if (typeof objects[j][path[i]] === "object") {
                    // Update object for next battle
                    objects[j] = objects[j][path[i]];
                } else {
                    // Object didn't survive the battle - so remove
                    sources.splice(j, 1);
                    objects.splice(j, 1);
                }
            }
        }

        // Last round is just checking the value
        for (j = objects.length - 1; j >= 0; j--) {
            if (typeof objects[j][path[path.length - 1]] !== "string") {
                sources.splice(j, 1);
                objects.splice(j, 1);
            }
        }

        // How many do we have now?
        if (objects.length > 1) {
            errors[errors.length] = {
                error: "Found " + path.join(".") + " in " +
                            sources.slice(0, sources.length - 1).join(", ") +
                            " and " + sources[sources.length - 1] +
                            ", picking content from " +
                            sources[sources.length - 1],
                type: "Conflict",
                path: _.clone(path),
                origins: _.clone(sources)
            };
        }
    };
    var errorHandler = function(e, value, path) {
        errors.push({
            error: "Found invalid type for " + path.join("."),
            type: "Unexpected type",
            path: _.clone(path)
        });
    };

    extensionIterator(handler, result, null, errorHandler);

    return errors;
}

function extensionIterator(handler, object, path, err) {
    if (!Array.isArray(path)) {
        path = [];
    }

    for (var i in object) {
        if (typeof object[i] === "object") {
            path.push(i);
            extensionIterator(handler, object[i], path, err);
            path.pop();

        } else if (typeof object[i] === "string") {
            path.push(i);
            handler(object[i], _.clone(path));
            path.pop();

        } else {
            path.push(i);
            if (typeof err === "function") {
                err(new Error("Invalid type"), object[i], _.clone(path));
            } else {
                throw new Error("Invalid type at " + path.join("."));
            }
            path.pop(i);
        }
    }
}

function merge(extensions) {
    var result = {};

    for (var i = 0; i < extensions.length; i++) {
        result = _.merge(result, extensions[i]);
    }

    return result;
}

function parse(options) {
    options = _.merge({
        'extensions': [path.join (__dirname, '../../extensions/')]
    }, options);

    if (!Array.isArray(options.extensions)) {
        options.extensions = [options.extensions];
    }

    var codeGen = "Game.extensions = AI.extensions = {\n";
    var results = [];
    var extensions = {};

    for (var i = 0; i < options.extensions.length; i++) {
        results[i] = readExtensionBundle(options.extensions[i]);
    }

    var checks = check(results, options.extensions);
    if (checks.length > 0) {
        for (i = 0; i < checks.length; i++) {
            console.log("Warning: " + checks[i].error);
        }
    }

    extensions = merge(results);

    for (var j in extensions) {
        codeGen += j + ": {\n";
        for (var k in extensions[j]) {
            var code = wrapCode(
                "var module = {};" +
                wrapCode(extensions[j][k]) +
                "return module.exports;"
            );

            // Remove ;
            code = code.slice(0, code.length - 3);

            codeGen += k + ": " + code + ",\n";
        }

        codeGen += "},\n";
    }

    codeGen += "};\n";

    return "function(){\n" + codeGen + "}";
}

function readExtensionBundle(dir) {
    var extensions = {};
    var bundles = [];
    var bundleDirectories = [];
    var bundleContent = fs.readdirSync(dir);
    var node;
    var i;

    // Iterate through directories of the bundle
    for (i = 0; i < bundleContent.length; i++) {
        node = path.join(dir, bundleContent[i]);

        if (fs.statSync(node).isDirectory()) {
            bundles.push(readExtensionPacket(node));
            bundleDirectories.push(node);
        }
    }

    // Output eventual warnings
    var checks = check(bundles, bundleContent, dir);
    if (checks.length > 0) {
        for (i = 0; i < checks.length; i++) {
            console.log("Warning: " + checks[i].error);
        }
    }

    extensions = merge(bundles);

    return extensions;
}

function readExtensionPacket(dir) {
    var extensions = {};
    var extensionContent = fs.readdirSync(dir);
    var file;

    // Iterate through subextension directories in the extension directory
    for (var i = 0; i < extensionContent.length; i++) {
        file = path.join(dir, extensionContent[i]);

        if (fs.statSync(file).isDirectory()) {
            extensions[extensionContent[i]] = readExtensionSubPacket(file);
        }
    }

    return extensions;
}

function readExtensionSubPacket(dir) {
    var extensions = {};
    var content = fs.readdirSync(dir);
    var filePath;
    var fileName;

    // Iterate through extension executables in the subextension directory
    for (var i = 0; i < content.length; i++) {
        filePath = path.join(dir, content[i]);
        fileName = content[i].substr(0, content[i].length - 3);

        // Look for valid files
        if (/^[^.].*\.js$/i.test(content[i]) && fs.statSync(filePath).isFile()) {
            extensions[fileName] = readExtension(filePath);
        }
    }

    return extensions;
}

function readExtension(file) {
    var code = fs.readFileSync(file, 'utf-8');

    // Strip off empty lines and use strict in front
    code = code.replace(/^([\t ]*[\r\n]+)*(("use strict"|'use strict');?)([\t ]*[\r\n]+)*/, "");

    // Strip off empty lines at the end
    code = code.replace(/([\t ]*[\r\n]+)*$/, "");

    return code;
}

function wrapCode(code) {
    return "(function(){\n" + code + "\n}());\n\n";
}

module.exports = {
    parse: parse,
    test: {
        check: check,
        extensionIterator: extensionIterator,
        merge: merge,
        readExtensionBundle: readExtensionBundle,
        readExtensionPacket: readExtensionPacket,
        readExtensionSubPacket: readExtensionSubPacket,
        readExtension: readExtension,
        wrapCode: wrapCode
    }
};