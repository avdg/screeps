'use strict';

var assert = require('assert');
var path = require('path');

var _ = require('lodash');

var extensionsCodegen = require('../../../lib/codegen/extensions');
var lib = require('../../../extensions/tools/library/utils');

var extensionMockLocation = path.join(__dirname, "../../../lib/mocks/extensions/");
var extensionScriptsMockLocation = path.join(__dirname, "../../../lib/mocks/scriptExtensions/");
var extensionLocation = path.join(extensionMockLocation, "demo/commands/test.js");
var badExtensionLocation = path.join(__dirname, "../../../lib/mocks/badExtensionFile.js");
var extensionContentParsed = "function command(flag, parameters) {\n    console.log(\"Hello world\");\n}\n\nmodule.exports = {\n    exec: command,\n    command: \"test\",\n    native: null,\n    help: 'Description:\\n- Executes Test\\n\\nUsage:\\n- Test',\n};";
var codegen = "function(){\nGame.extensions = AI.extensions = {\ncommands: {\ntest: (function(){\nvar module = {};(function(){\nfunction command(flag, parameters) {\n    console.log(\"Hello world\");\n}\n\nmodule.exports = {\n    exec: command,\n    command: \"test\",\n    native: null,\n    help: \'Description:\\n- Executes Test\\n\\nUsage:\\n- Test\',\n};\n}());\n\nreturn module.exports;\n}()),\n},\n};\n}";
var scriptCodeGen = "function(){\nGame.extensions = AI.extensions = {\nscripts: {\nmain: (function(){\nvar module = {};(function(){\nfunction test() {\n    // Do something usefull\n}\n\nmodule.exports = function() {\n    test();\n};\n}());\n\nreturn module.exports;\n}()),\n},\n};\nreturn Game.extensions.scripts.main;\n}";

describe('CodeGen: extensions', function() {
    describe('check', function() {
        it('Should not give warnings if there are no conflicts', function() {
            var errors = [];
            var check = function() {
                return extensionsCodegen.test.check(
                    [
                        {foo: 'bar'},
                        {foobar: 'baz'}
                    ],
                    ['a', 'b']
                );
            };

            assert.deepEqual(lib.bufferConsole(check, errors), []);
            assert.deepEqual(errors, []);
        });

        it('Should warn about merge conflicts in trees', function() {
            var errors = [];
            var check = function() {
                return extensionsCodegen.test.check(
                    [
                        {foo: 'bar', hello: "world"},
                        {foo: 'baz'},
                        {}
                    ], ['a', 'b', 'c']
                );
            };

            assert.deepEqual(lib.bufferConsole(check, errors),
                [
                    {
                        error: "Found foo in a and b, picking content from b",
                        type: "Conflict",
                        path: ["foo"],
                        origins: ["a", "b"]
                    }
                ]
            );
            assert.deepEqual(errors, []);
        });

        it('Should warn about merge conflicts in deep trees', function() {
            var errors = [];
            var check = function() {
                return extensionsCodegen.test.check(
                    [
                        {foo: {foobar: 'bar'}},
                        {foo: {foobar: 'baz'}},
                        {foo: {hello: "world"}},
                        {hello: "world"}
                    ], ['a', 'b', 'c', 'd']
                );
            };

            assert.deepEqual(lib.bufferConsole(check, errors),
                [
                    {
                        error: "Found foo.foobar in a and b, picking content from b",
                        type: "Conflict",
                        path: ["foo", "foobar"],
                        origins: ["a", "b"]
                    }
                ]
            );
            assert.deepEqual(errors, []);
        });
        it('Should warn about invalid object in trees', function() {
            var errors = [];
            var check = function() {
                return extensionsCodegen.test.check(
                    [
                        {foo: {foobar: 'bar'}},
                        {foo: {hello: "world"}},
                        {hello: "world"},
                        {'a': 0}
                    ], ['a', 'b', 'c', 'd']
                );
            };

            assert.deepEqual(lib.bufferConsole(check, errors),
                [
                    {
                        error: "Found invalid type for a",
                        type: "Unexpected type",
                        path: ["a"]
                    }
                ]
            );
            assert.deepEqual(errors, []);
        });
        it('Should output errors in console when setting the verbose parameter to true', function() {
            var errors = [];
            var check = function() {
                return extensionsCodegen.test.check(
                    [
                        {foo: {foobar: 'bar'}},
                        {foo: {hello: "world"}},
                        {hello: "world"},
                        {'a': 0}
                    ], ['a', 'b', 'c', 'd'], null, true
                );
            };

            assert.deepEqual(lib.bufferConsole(check, errors),
                [
                    {
                        error: "Found invalid type for a",
                        type: "Unexpected type",
                        path: ["a"]
                    }
                ]
            );
            assert.deepEqual(errors, [
                ["Warning: Found invalid type for a"]
            ]);
        });
    });

    describe('extensionIterator', function() {
        var testObject = {
            foo: {
                bar: 'a',
                bazBar: {fooBar: 'e'}
            },
            baz: 'b',
            foobar: 'c',
            bazBar: {foo: {bar: "d"}}
        };

        it('Should list all items in the extension object', function() {
            var result = {};
            extensionsCodegen.test.extensionIterator(
                function(content, path) {
                    result[content] = path;
                },
                testObject
            );

            assert.deepEqual(result, {
                a: ['foo', 'bar'],
                b: ['baz'],
                c: ['foobar'],
                d: ['bazBar', 'foo', 'bar'],
                e: ['foo', 'bazBar', 'fooBar']
            });
        });

        it('Should be able to iterate in a sub path alone', function() {
            var result = {};
            extensionsCodegen.test.extensionIterator(
                function(content, path) {
                    result[content] = path;
                },
                testObject.foo,
                ['foo']
            );

            assert.deepEqual(result, {
                a: ['foo', 'bar'],
                e: ['foo', 'bazBar', 'fooBar']
            });
        });

        it('Should thrown an error if the object contains invalid items', function() {
            var hasInvalidObject = function() {
                extensionsCodegen.test.extensionIterator(
                    function(){},
                    {foo: {bar: 0}}
                );
            };

            var errorValidator = function(e) {
                return e instanceof Error &&
                    e.message === "Invalid type at foo.bar";
            };

            assert.throws(hasInvalidObject, errorValidator);
        });

        it('Should pass the error to the error handler if provided and continue iterating', function() {
            var errors = [];
            var result = {};
            var modifiedTestObject = _.clone(testObject);

            var errorHandler = function(e, value, path) {
                errors.push([e, value, path]);
            };
            var handler = function(content, path) {
                result[content] = path;
            };

            modifiedTestObject.foo.err = 0;

            extensionsCodegen.test.extensionIterator(handler, modifiedTestObject, null, errorHandler);
            assert.deepEqual(result, {
                a: ['foo', 'bar'],
                b: ['baz'],
                c: ['foobar'],
                d: ['bazBar', 'foo', 'bar'],
                e: ['foo', 'bazBar', 'fooBar']
            });
            assert.deepEqual(errors, [
                [new Error("Invalid type"), 0, ['foo', 'err']]
            ]);
        });
    });

    describe("extensionCodeGenerator", function() {
        it("Should be able to parse extensions and output code", function() {
            var extensions = {
                test: {
                    something: function() {}
                }
            };
            var output = "function(){\nGame.extensions = AI.extensions = {\ntest: {\nsomething: (function(){\nvar module = {};(function(){\nfunction () {}\n}());\n\nreturn module.exports;\n}()),\n},\n};\n}";

            assert.equal(extensionsCodegen.test.extensionsCodeGenerator(extensions), output);
        });

        it("Should be able to quote keys if necessary", function() {
            var extensions = {
                "test something": {
                    "with quotes": function() {}
                }
            };
            var output = "function(){\nGame.extensions = AI.extensions = {\n\"test something\": {\n\"with quotes\": (function(){\nvar module = {};(function(){\nfunction () {}\n}());\n\nreturn module.exports;\n}()),\n},\n};\n}";

            assert.equal(extensionsCodegen.test.extensionsCodeGenerator(extensions), output);
        });
    });

    describe('merge', function() {
        it('Should merge different trees with ease', function() {
            assert.deepEqual(
                extensionsCodegen.test.merge(
                    [
                        {foo: 'bar'},
                        {foobar: 'baz'}
                    ]
                ), {
                    foo: 'bar',
                    foobar: 'baz'
                }
            );
        });

        it('Should prefer the last in the array on merge conflict', function() {
            assert.deepEqual(
                extensionsCodegen.test.merge(
                    [
                        {foo: 'bar'},
                        {foo: 'baz'}
                    ]
                ),{
                    foo: 'baz'
                }
            );
        });

        it('Should be able to merge deeply', function() {
            assert.deepEqual({
                foo: {bar: 'foobar'}
            }, extensionsCodegen.test.merge([
                {foo: {bar: 'baz'}},
                {foo: {bar: 'foobar'}}
            ]));
        });
    });

    describe('parse', function() {
        it('Should read the extensions/ folder and return code', function() {
            var result = extensionsCodegen.parse({
                extensions: extensionMockLocation
            });

            assert.equal(result, codegen);
        });

        it('Should add a boot hook if module scripts/main', function() {
            var result = extensionsCodegen.parse({
                extensions: extensionScriptsMockLocation
            });

            assert.equal(result, scriptCodeGen);
        });
    });

    describe('quote', function() {
        var tests = [
            ["Should keep normal names as it it", "Atestz", "Atestz"],
            ["Should replace double quotes and backslashes", "\\\"test\"\\", "\"\\\\\\\"test\\\"\\\\\""],
            ["Should replace control characters by their unicode notation", "\u0000\u001f\u0020", "\"\\u0000\\u001f \""],
            ["Should put inputs with characters higher than code point 127 between quotes", "€", "\"€\""],
            ["Should put inputs starting with digits between quotes", "0test", "\"0test\""],
            ["Should put inputs with characters below ascii code 48 (0) between quotes unless these characters are $", "!test", "\"!test\""],
            ["Should not put inputs with $ between quotes", "$test", "$test"],
            ["Should put inputs with characters above ascii code 122 (z) between quotes", "{test", "\"{test\""],
            ["Should put inputs with characters between 90 (Z) and 97 (a) between quotes unless these characters are _", "[test", "\"[test\""],
            ["Should not put inputs with _ between quotes", "_test", "_test"],
            ["Should put inputs with characters between 57 (9) and 65 (A) between quotes", ":@test", "\":@test\""]
        ];

        var runQuoteTest = function(test) {
            return function() {
                it(test[0], function() {
                    assert.strictEqual(extensionsCodegen.test.quotify(test[1]), test[2]);
                });
            };
        };

        for (var i = 0; i < tests.length; i++) {
            runQuoteTest(tests[i])();
        }
    });

    describe('readExtension', function() {
        it('Should read the test extension', function() {
            assert.equal(
                extensionsCodegen.test.readExtension(extensionLocation),
                extensionContentParsed
            );
        });

        it('Should throw an error if a file contains syntax error', function() {
            var run = function() {
                extensionsCodegen.test.readExtension(badExtensionLocation);
            };

            var testSyntaxError = function(e) {
                return e instanceof Error &&
                    /^Error in parsing [^\n]*badExtensionFile\.js:\n.*Unexpected token }\n(\n.*)+$/.test(e.message);
            };

            assert.throws(run, testSyntaxError);
        });
    });

    describe('readExtensionBundle', function() {
        it('Should read the extensions/ folder and put it into an object', function() {
            var buffer = [];

            assert.deepEqual(
                lib.bufferConsole(function() {
                    return extensionsCodegen.test.readExtensionBundle(
                        extensionMockLocation
                    );
                }, buffer),
                {commands: {test: extensionContentParsed}}
            );

            assert.deepEqual(buffer, []);
        });
    });

    describe('readExtensionPacket', function() {
        it('Should read the test extension from demo/ and put it into an object', function() {
            assert.deepEqual(
                extensionsCodegen.test.readExtensionPacket(
                    path.join(extensionMockLocation, "demo/")
                ),
                {commands: {test: extensionContentParsed}}
            );
        });
    });

    describe('readExtensionSubPacket', function() {
        it('Should read the test extension from demo/commands and put it into an object', function() {
            assert.deepEqual(
                extensionsCodegen.test.readExtensionSubPacket(
                    path.join(extensionMockLocation, "demo/commands")
                ),
                {test: extensionContentParsed}
            );
        });
    });

    describe('wrapCode', function() {
        it('Should wrap this', function() {
            assert.equal(
                extensionsCodegen.test.wrapCode("this"),
                "(function(){\nthis\n}());\n\n"
            );
        });
    });
});