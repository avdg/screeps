'use strict';

var assert = require("assert");

var lib = require("../../../../extensions/tools/library/format");

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
    });
});