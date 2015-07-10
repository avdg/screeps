'use strict';

var assert = require("assert");

var lib = require("../../../../extensions/tools/library/format");

// Custom align function as alternative to pass as options.align
var customAlign = function(content, length) {
    var spaces = (length - content.length);

    var frontSpaces = Math.min(spaces, 3);
    var backSpaces = spaces - frontSpaces;
    var result = "";

    for (var i = 0; i < frontSpaces; i++) {
        result += " ";
    }

    result += content;

    for (var j = 0; j < backSpaces; j++) {
        result += " ";
    }

    return result;
};

describe("Library extension: format", function() {

    describe("alignColumns", function() {
        it("Should not fail for empty input", function() {
            var data = [];
            var output = "";

            assert.equal(lib.alignColumns(data), output);
        });

        it("Should be able to merge simple sentences", function() {
            var data = [
                [
                    "Hi, this is a test",
                    "This is a test on an other line",
                    "And this is the final line"
                ]
            ];
            var output =
                "Hi, this is a test             \n" +
                "This is a test on an other line\n" +
                "And this is the final line     \n";

            assert.equal(lib.alignColumns(data), output);
        });

        it("Should be able to merge multiple columns of data", function() {
            var data = [
                [
                    "Passing some strings",
                    "Just a few columns",
                    "Thats all"
                ],
                [
                    "This is another column",
                    "With some text",
                    "Nothing more"
                ]
            ];

            var output =
                "Passing some strings - This is another column\n" +
                "Just a few columns   - With some text        \n" +
                "Thats all            - Nothing more          \n";

            assert.equal(lib.alignColumns(data), output);
        });

        it("Should give an appropriate error if array contains strings instead of array containing array of strings", function() {
            var data = [
                "Not an array of string"
            ];

            var attemptArrayOfString = function() {
                lib.alignColumns(data);
            };
            var expected = function(e) {
                return e instanceof Error &&
                    e.message === "Expected an array of array strings but got an array of strings instead.";
            };

            assert.throws(attemptArrayOfString, expected);
        });

        it("Should be able to change option glue", function() {
            var data = [
                [
                    "Some data will get",
                    "glued"
                ],
                [
                    "Glued,",
                    "thats how this line will appear"
                ]
            ];

            var output =
                "Some data will get : Glued,                         \n" +
                "glued              : thats how this line will appear\n";

            assert.equal(lib.alignColumns(data, {glue: ' : '}), output);
        });

        it("Should be possible to pass an array for option glue", function() {
            var data = [
                [
                    "1",
                    "2",
                    "3"
                ],
                [
                    "a",
                    "b",
                    "c"
                ],
                [
                    "I",
                    "II",
                    "III"
                ]
            ];

            var output =
                "1 | a ~ I  \n" +
                "2 | b ~ II \n" +
                "3 | c ~ III\n";

            assert.equal(lib.alignColumns(data, {glue: [' | ', ' ~ ']}), output);
        });

        it("Should be able to change option tail", function() {
            var data = [
                [
                    "Look at the tail",
                    "its a bit different than usual"
                ],
                [
                    "Its weird",
                    "not formatted using the default tail"
                ]
            ];

            var output =
                "Look at the tail               - Its weird                            =)\n" +
                "its a bit different than usual - not formatted using the default tail =)\n";

            assert.equal(lib.alignColumns(data, {tail: " =)\n"}), output);
        });

        it("Should be possible to pass a function for option align", function() {
            var data = [
                [
                    "This is an extremely simple test",
                    "Ending with a short line"
                ]
            ];

            var output =
                "This is an extremely simple test\n" +
                "   Ending with a short line     \n";

            assert.equal(lib.alignColumns(data, {align: customAlign}), output);
        });

        it("Should be possible to use a string for option align if the function recognizes it", function() {
            var data = [
                [
                    "This is a very long line",
                    "This line is centered"
                ]
            ];

            var output =
                "This is a very long line\n" +
                " This line is centered  \n";

            assert.equal(lib.alignColumns(data, {align: "center"}), output);
        });

        it("Should default to left alignment if the align option isn't recognized", function() {
            var data = [
                [
                    "So we're back at square one",
                    "Because we picked the wrong option"
                ]
            ];

            var output =
                "So we're back at square one       \n" +
                "Because we picked the wrong option\n";

            assert.equal(lib.alignColumns(data, {align: ["unexestingOption"]}), output);
        });

        it("Should be able to change option align by passing an array", function() {
            var data = [
                [
                    "This is center aligned",
                    "Note the spaces on the left and on the right"
                ],
                [
                    "This is left aligned",
                    "Note the spaces on the right"
                ],
                [
                    "This is right aligned",
                    "Note the spaces on the left"
                ],
                [
                    "This is align at least 3 spaces from the left where it can",
                    "Because its all weird and because we simply can do it",
                    "And this line is very short",
                    "But this line is very long long long long long long long"
                ]
            ];

            var output =
                "           This is center aligned            - This is left aligned         -       This is right aligned - This is align at least 3 spaces from the left where it can\n" +
                "Note the spaces on the left and on the right - Note the spaces on the right - Note the spaces on the left -    Because its all weird and because we simply can do it  \n" +
                "                                             -                              -                             -    And this line is very short                            \n" +
                "                                             -                              -                             -   But this line is very long long long long long long long\n";

            assert.equal(lib.alignColumns(data, {align: ["center", "left", "right", customAlign]}), output);
        });
    });
});