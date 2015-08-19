'use strict';

var _ = require("lodash");
var fs = require("fs");
var path = require("path");

/**
 * Produces error messages for directory containing extensions
 *
 * @param extensions Array A list of objects containing extensions,
 *                   Last item will survive if merge conflict happens
 * @param origins Array Path of the extension paths
 * @param prefix String Prefix that has to be appended to all origins (optional)
 * @param verbose Bool Print errors using console.log when set to true
 *
 * @return Array A list of errors, which can be empty
 */
function check(extensions, origins, prefix, verbose) {
    var result = merge(extensions);
    var errors = [];

    var handler = function(content, extPath) {
        var i, j;
        // Copy object and reference
        var sources = _.clone(origins);
        var objects = [];

        for (i = 0; i < extensions.length; i++) {
            objects.push(extensions[i]);
        }

        // Remove objects without path to content
        for (i = 0; i < (extPath.length - 1); i++) {
            // Count down to avoid conflict when removing
            for (j = objects.length - 1; j >= 0; j--) {
                if (typeof objects[j][extPath[i]] === "object") {
                    // Update object for next battle
                    objects[j] = objects[j][extPath[i]];
                } else {
                    // Object didn't survive the battle - so remove
                    sources.splice(j, 1);
                    objects.splice(j, 1);
                }
            }
        }

        // Last round is just checking the value
        for (j = objects.length - 1; j >= 0; j--) {
            if (typeof objects[j][extPath[extPath.length - 1]] !== "string") {
                sources.splice(j, 1);
                objects.splice(j, 1);
            }
        }

        // How many do we have now?
        if (objects.length > 1) {
            errors[errors.length] = {
                error: "Found " + extPath.join(".") + " in " +
                            sources.slice(0, sources.length - 1).join(", ") +
                            " and " + sources[sources.length - 1] +
                            ", picking content from " +
                            sources[sources.length - 1],
                type: "Conflict",
                path: _.clone(extPath),
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

    extensionIterator(handler, result, prefix, errorHandler);

    if (verbose) {
        for (var i = 0; i < errors.length; i++) {
            console.log("Warning: " + errors[i].error);
        }
    }

    return errors;
}

/**
 * Iterates through a list of extensions given an object containing extensions
 *
 * An object with extensions can only contain objects or stringified code
 * There is no limit on how deep code can be.
 *
 * @param handler Function Accepts code as first argument and its path as second
 * @param object Object An object that contains extensions
 * @param path Array Already traveled path (should be kept undefined unless iterating at least 1 level deep)
 * @param err Function A function that can eat an error as first argument
 *            Second argument will be the object in question,
 *            while the third argument will be the path.
 *
 * @return void
 * @throws Error When no error handler has been given
 */
function extensionIterator(handler, object, extPath, err) {
    if (!Array.isArray(extPath)) {
        extPath = [];
    }

    for (var i in object) {
        if (typeof object[i] === "object") {
            extPath.push(i);
            extensionIterator(handler, object[i], extPath, err);
            extPath.pop();

        } else if (typeof object[i] === "string") {
            extPath.push(i);
            handler(object[i], _.clone(extPath));
            extPath.pop();

        } else {
            extPath.push(i);
            if (typeof err === "function") {
                err(new Error("Invalid type"), object[i], _.clone(extPath));
            } else {
                throw new Error("Invalid type at " + extPath.join("."));
            }
            extPath.pop(i);
        }
    }
}

function extensionsCodeGenerator(extensions, options) {
    options = options || {};

    var codeGen = "Game.extensions = AI.extensions = {\n";

    // Generate module code
    for (var j in extensions) {
        codeGen += quotify(j) + ": {\n";
        for (var k in extensions[j]) {
            var code = wrapCode(
                "var module = {};" +
                wrapCode(extensions[j][k]) +
                "return module.exports;"
            );

            // Remove ;
            code = code.slice(0, code.length - 3);

            codeGen += quotify(k) + ": " + code + ",\n";
        }

        codeGen += "},\n";
    }

    codeGen += "};\n";

    // Generate code to run boot code if necessary
    if (options.extensionsBootstrap &&
        extensions.scripts !== undefined &&
        extensions.scripts.main
    ) {
        codeGen += "return Game.extensions.scripts.main;\n";
    }

    codeGen = "function(){\n" + codeGen + "}";

    return codeGen;
}

/**
 * Merges a list of extensions
 *
 * Last item will survive if merge conflict happens
 *
 * @param Array Containing objects representing extensions
 *
 * @return Object Containing merged extensions
 */
function merge(extensions) {
    var result = {};

    for (var i = 0; i < extensions.length; i++) {
        result = _.merge(result, extensions[i]);
    }

    return result;
}

/**
 * Parses directories containing extensions
 * You are here: <list of extension directories> - bundle - packet - subpacket - extension
 *
 * When merging bundles, only the least one in the list will survive.
 * Warnings can be disabled with setting the option
 * 'extensionsWarnOnConflict' to 'some', or to 'none'.
 *
 * @param options Object Contains settings
 *
 * @return String Containing generated code
 */
function parse(options) {
    options = _.merge({
        extensions: [path.join (__dirname, '../../extensions/')],
        extensionsWarnOnConflict: 'all',
        extensionsBootstrap: true
    }, options);

    if (!Array.isArray(options.extensions)) {
        options.extensions = [options.extensions];
    }

    var results = [];
    var extensions = {};

    // Read each given extension path
    for (var i = 0; i < options.extensions.length; i++) {
        results[i] = readExtensionBundle(options.extensions[i], options);
    }

    // Give errors on conflicts
    check(results, options.extensions, undefined,
        options.extensionsWarnOnConflict.toLowerCase() === 'all'
    );

    extensions = merge(results);

    return extensionsCodeGenerator(extensions, options);
}

function quotify(input) {
    var quote = false;

    var output = input.replace(/[\"\\\u0000-\u001f]/g, function(match) {
        var oldFlag = quote;
        quote = true;

        // Replace characters
        switch(match) {
            case '"': return '\\\"';
            case '\\': return "\\\\";
            default:
        }

        // Replace control characters
        var charCode = match.charCodeAt(0);
        if (match.length === 1 && charCode < 32) {
            return "\\u00" + (charCode >= 16 ? "1" : "0") + (charCode % 16).toString(16);
        }

        // Not replacing anything, restore flag
        quote = oldFlag;

        // Lets throw an error for now
        throw new Error("Invalid replace match " + match);
    });

    // When key starts with a digit, put key between quotes
    if(!quote && "0123456789".indexOf(input[0]) > -1) {
        quote = true;
    }

    if (!quote) {
        // Put every string with special unicode values between quotes
        for (var i = 0; i < input.length; i++) {
            var charCode = input.charCodeAt(i);
            // skip all characters above ascii 122 (z) and 128 (non-defined ascii)
            if (charCode > 122) {
                quote = true;
                break;
            } else if (charCode < 48 /* 48 : "0" */ && charCode !== 36 /* 36: "$" */) {
                quote = true;
                break;
            } else if (
                charCode > 90 /* 90: "Z" */ &&
                charCode < 97 /* 97: "a" */ &&
                charCode !== 95 /* 95: "_" */
            ) {
                quote = true;
                break;
            } else if (
                charCode > 57 /* 57: "9" */ &&
                charCode < 65 /* 65: "A" */
            ) {
                quote = true;
                break;
            }
        }
    }

    if (quote) {
        output = '"' + output + '"';
    }

    return output;
}

/**
 * Reads a file containing an extension
 * You are here: list of extension directories - bundle - packet - subpacket - <extension>
 *
 * Strips off `'use strict'` and empty lines at the beginning and the end of the file.
 *
 * @param String Path to the extension file
 *
 * @return String Containing code of the extension
 */
function readExtension(file) {
    var code = fs.readFileSync(file, 'utf-8');

    // Strip off empty lines and use strict in front
    code = code.replace(/^([\t ]*[\r\n]+)*(("use strict"|'use strict');?)([\t ]*[\r\n]+)*/, "");

    // Strip off empty lines at the end
    code = code.replace(/([\t ]*[\r\n]+)*$/, "");

    // Validate the code
    try {
        new Function(code);
    } catch (e) {
        throw new Error("Error in parsing " + file + ":\n" + e.message + "\n\n" + e.stack);
    }

    return code;
}

/**
 * Reads a directory in an extensions directory (a bundle)
 * You are here: list of extension directories - <bundle> - packet - subpacket - extension
 *
 * Since no order can be given, it will give merge conflict warnings
 * when merging extensions from multiple packets.
 * Warnings can be disabled with setting the option
 * 'extensionsWarnOnConflict' to 'none'.
 *
 * @param String Path to the extension bundle
 *
 * @return Object containing extensions
 */
function readExtensionBundle(dir, options) {
    options = _.merge({
        extensionsWarnOnConflict: 'all'
    }, options);

    var extensions = {};
    var bundles = [];
    var bundleDirectories = [];
    var bundleContent = fs.readdirSync(dir);
    var node;
    var i;

    // Iterate through directories of the bundle
    for (i = 0; i < bundleContent.length; i++) {
        // Skip any entry starting with a dot
        if (bundleContent[i][0] === ".") {
            continue;
        }

        // Get full path
        node = path.join(dir, bundleContent[i]);

        // Parse packet if current entry is a directory
        if (fs.statSync(node).isDirectory()) {
            bundles.push(readExtensionPacket(node));
            bundleDirectories.push(node);
        }
    }

    // Output eventual warnings
    check(bundles, bundleContent, dir,
        options.extensionsWarnOnConflict.toLowerCase() !== 'none'
    );

    extensions = merge(bundles);

    return extensions;
}

/**
 * Reads a directory in a bundle which usually is located in an extensions directory
 * You are here: list of extension directories - bundle - <packet> - subpacket - extension
 *
 * @param String Path to the packet directory
 *
 * @return Object containing extensions
 */
function readExtensionPacket(dir) {
    var extensions = {};
    var extensionContent = fs.readdirSync(dir);
    var file;

    // Iterate through subextension directories in the extension directory
    for (var i = 0; i < extensionContent.length; i++) {
        // Skip any entry starting with a dot
        if (extensionContent[i][0] === ".") {
            continue;
        }

        // Get full path
        file = path.join(dir, extensionContent[i]);

        // Parse sub packet if current entry is a directory
        if (fs.statSync(file).isDirectory()) {
            extensions[extensionContent[i]] = readExtensionSubPacket(file);
        }
    }

    return extensions;
}

/**
 * Reads a directory in an extensions directory
 * You are here: list of extension directories - bundle - packet - <subpacket> - extension
 *
 * @param String Path the the subpacket directory (representing a type of extensions)
 *
 * @return Object containing extensions
 */
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

function wrapCode(code) {
    return "(function(){\n" + code + "\n}());\n\n";
}

module.exports = {
    parse: parse,
    test: {
        check: check,
        extensionIterator: extensionIterator,
        extensionsCodeGenerator: extensionsCodeGenerator,
        merge: merge,
        quotify: quotify,
        readExtensionBundle: readExtensionBundle,
        readExtensionPacket: readExtensionPacket,
        readExtensionSubPacket: readExtensionSubPacket,
        readExtension: readExtension,
        wrapCode: wrapCode
    }
};