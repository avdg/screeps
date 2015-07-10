'use strict';

var whitespaces = "                                                                                                    ";
var align = {
    left: function(message, length) {
        return message + getWhiteSpace(length - message.length);
    },
    center: function(message, length) {
        var spaces = length - message.length;
        var spacesFront = spaces >> 1;

        return getWhiteSpace(spacesFront) + message + getWhiteSpace(spaces - spacesFront);
    },
    right: function(message, length) {
        return getWhiteSpace(length - message.length) + message;
    }
};

function getWhiteSpace(length) {
    if (length > whitespaces.length) {
        whitespaces += whitespaces;
    }

    return whitespaces.substr(0, length);
}

function alignColumns(data, options) {
    var defaultGlue = " - ";

    // Collect the number of rows to allocate, and the formatting length for columns
    var length = [];
    var rows = 0;
    for (var i = 0; i < data.length; i++) {
        if (!Array.isArray(data[i])) {
            throw Error("Expected an array of array strings but got an array of " + (typeof data[i]) + "s instead.");
        }

        rows = Math.max(rows, data[i].length);
        length.push(0);
        for (var j = 0; j < data[i].length; j++) {
            length[i] = Math.max(length[i], data[i][j].length);
        }
    }

    // Make sure the options are valid
    if (options === undefined) {
        options = {};
    }

    if (Array.isArray(options.glue)) {
        for (var c = 0; c < data.length; c++) {
            if (typeof options.glue[c] !== "string") {
                options.glue[c] = defaultGlue;
            }
        }
    } else if (typeof options.glue !== "string") {
        options.glue = defaultGlue;
    }

    if (typeof options.tail !== "string") {
        options.tail = "\n";
    }

    if (Array.isArray(options.align)) {
        for (var d = 0; d < data.length; d++) {
            if (typeof options.align[d] === "string" && align[options.align[d]] !== undefined) {
                options.align[d] = align[options.align[d]];
            } else if (typeof options.align[d] !== "function") {
                options.align[d] = align.left;
            }
        }
    } else if (typeof options.align === "string" && align[options.align] !== undefined) {
        options.align = align[options.align];
    } else if (typeof options.align !== "function") {
        options.align = align.left;
    }

    // Concatenate all the data
    var message = "";

    // Iteration: in each array, pick element row
    for (var row = 0; row < rows; row++) {
        var append = "";
        var cell = "";

        for (var col = 0; col < data.length; col++) {
            cell = data[col][row] || "";

            message += append;
            message += (Array.isArray(options.align) ? options.align[col] : options.align)(cell, length[col]);
            append = Array.isArray(options.glue) ? options.glue[col] : options.glue;
        }

        message += options.tail;
    }

    return message;
}

module.exports = {
    alignColumns: alignColumns,
    test: {
        align: align
    }
};