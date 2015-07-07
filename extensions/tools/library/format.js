'use strict';

var whitespaces = "                                                                                                    ";

function getWhiteSpace(length) {
    if (length > whitespaces.length) {
        whitespaces += whitespaces;
    }

    return whitespaces.substr(0, length);
}

function alignColumns(data, options) {

    // Make sure the options are valid
    if (options === undefined) {
        options = {};
    }

    if (typeof options.glue !== "string") {
        options.glue = "";
    }

    if (typeof options.tail !== "string") {
        options.tail = "\n";
    }

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

    // Concatenate all the data
    var message = "";

    // Iteration: for each array, pick element n
    for (var row = 0; row < rows; row++) {
        var append = "";
        var cell = "";

        for (var col = 0; col < data.length; col++) {
            cell = data[col][row] || "";
            cell += getWhiteSpace(length[col] - cell.length);

            message += append + cell;
            append = (Array.isArray(options.glue) ? options.glue[col] : options.glue) || " - ";
        }

        message += options.tail;
    }

    return message;
}

module.exports = {
    alignColumns: alignColumns
};