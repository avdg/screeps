'use strict';

var extensions = function(){
    global.AI = {};

    AI.extensions = {
        commands: {
            test: (function() {
                var module = {};
                (function() {
                    function command(flag, parameters) {
                        console.log("Hello world");
                    }

                    module.exports = {
                        exec: command,
                        command: "test",
                        native: null,
                        help: 'Description:\n- Executes Test\n\nUsage:\n- Test'
                    };
                }());

                return module.exports;
            }()),
            testWithNative: (function() {
                var module = {};
                (function() {
                    function command() {
                        console.log("Hello world");
                    }

                    function exec(flag, parameters) {
                        command();
                    }

                    function native() {
                        command();
                    }

                    module.exports = {
                        exec: exec,
                        command: "test",
                        native: native,
                        help: 'Description:\n- Executes Test\n\nUsage:\n- Test'
                    };
                }());

                return module.exports;
            }()),
        }
    };
};

var generated = function() {
    extensions();
};

module.exports = generated;
generated();