"use strict";

// // Script to get all characters that are not escaped using json
// for (var result = [], char, i = 0, j; i < 128; i++) {
//     char = JSON.stringify(String.fromCharCode(i));
//     if (char.length === 3) {
//         result.push(char[1]);
//     }
// }
// console.log(result, result.join("") + "\n" + result.length);
var jsonSafe = " !#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[]^_`abcdefghijklmnopqrstuvwxyz{|}~\x7f".split(""); // length: 94 - note that last char is the invisible <delete>
var base91Chars = "!#$%&'()*+,./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[]^_`abcdefghijklmnopqrstuvwxyz{|}~".split(""); // length: 91 (without space, -, <delete>)

function getCustomBase(options) {
    var chars;
    var negative;
    var map = {};

    if (!options) {
        options = {};
    }

    chars = options.chars || jsonSafe;
    negative = options.negative !== undefined ? options.negative : (chars === jsonSafe ? "\\" : "-");

    for (var i = 0; i < chars.length; i++) {
        map[chars[i]] = i;
        if (chars[i] === negative) {
            throw new Error("Found negative sign " + negative + " in chars " + JSON.stringify(chars));
        }
    }

    function encode(number) {

        if (!Number.isInteger(number)) {
            return;
        }

        var result = "";
        var isNegative = number < 0;

        number = Math.abs(number);

        while (number !== 0) {
            result = chars[number % chars.length] + result;
            number = Math.floor(number / chars.length);
        }

        if (isNegative) {
            result = negative + result;
        }

        if (result === "") {
            result = chars[0];
        }

        return result;
    }

    function decode(encoded) {
        var result = 0;
        var isNegative = encoded[0] === negative;

        for (var i = isNegative ? 1 : 0; i < encoded.length; i++) {
            result *= chars.length;
            result += map[encoded[i]];
        }

        return isNegative ? -result : result;
    }

    return {
        encode: encode,
        decode: decode,
        get chars() { return chars; },
        get negative() { return negative; }
    };
}

var base94 = getCustomBase();
var base91 = getCustomBase({chars: base91Chars});

/**
 * Converts a string into encoded strings of 91 different characters
 *
 * It's using the fact that 2**13 (8192) is smaller than 91**2 (8281)
 * So the encoded string doesn't use all possible combinations of 91**2
 * (only 98.92 % of it) but its still enough to get a lot of data in it,
 * resulting in a shorter string than using base64.
 *
 * Input length of 487 chars will result in 652 base64 and 601 encode91
 */
function encodeBinary(input) {
    var output = "";
    var prefix = "";
    var number = 0;
    var base = 0; // Base of 2 left in buffer
    var pos = 0;
    var convert;
    var tmp;

    while (pos < input.length) {
        // Add character
        base += 8;
        tmp = input.charCodeAt(pos);

        if (tmp > 255) {
            throw new Error("Input with code point " + tmp + " out of range of 255 chars");
        }

        number = (number << 8) + tmp;
        pos++;

        while (base >= 13) {
            // Get hi 13 bits to be extracted
            base -= 13;
            convert = number >>> base;

            // Convert hi 13 bits to string
            tmp = base91.encode(convert);
            output += tmp.length === 2 ? tmp : base91.encode(0) + tmp;

            // Subtract hi 13 bits from total
            number -= convert << base;
        }
    }

    // 1 or 2 characters in last bit?
    prefix = base > 8 ? "-" : "";

    // Last characters of encoder - reduce to single char if output is small enough
    if (base > 0 && base < 7) {
        number = number << (6 - base); // Fill with zeroes
        output += base91.encode(number);
    } else if (base > 0) {
        number = number << (13 - base); // Fill with zeroes
        output += base91.encode(number);
    }

    return prefix + output;
}

function decodeBinary(decoded) {
    if (decoded.length < 1) {
        return "";
    }

    var bytesTail = decoded[0] === "-" ? 0 : 1;
    var pos = decoded[0] === "-" ? 1 : 0;
    var output = "";
    var tmp;
    var number = 0;
    var base = 0;

    // Read input
    while (decoded.length - pos > 2) {
        number = (number << 13) + base91.decode(decoded.substr(pos, 2));
        base += 13;
        pos += 2;

        while (base >= 8) {
            base -= 8;
            tmp = number >>> (base); // Read 8 high bytes
            output += String.fromCharCode(tmp);
            number -= tmp << base;
        }
    }

    // Read last digits
    if (decoded.length - pos === 2) {
        number = (number << 13) + base91.decode(decoded.substr(pos, 2));
        base += 13;
    } else if (decoded.length - pos === 1) {
        number = (number << 6) + base91.decode(decoded[pos]);
        base += 6;
    } else {
        throw new Error("Please make an issue, report `decodeBinary(" + JSON.stringify(decoded) + ")` as test case of this bug");
    }

    while (bytesTail > 0) {
        base -= 8;
        bytesTail--;
        tmp = number >>> base; // Read 8 high bytes
        output += String.fromCharCode(tmp);
        number -= tmp << base;
    }

    return output;
}

module.exports = {
    getCustomBase: getCustomBase,
    base91: base91,
    base94: base94,
    encodeBinary: encodeBinary,
    decodeBinary: decodeBinary
};