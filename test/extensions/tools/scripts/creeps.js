'use strict';

var assert = require("assert");
var simple = require("simple-mock");

var _ = require("lodash");
var creepsScript = require("../../../../extensions/tools/scripts/creeps");
var lib = _.merge(
    require("../../../../extensions/tools/library/hooks"),
    require("../../../../extensions/tools/library/utils")
);

describe("Script extension: creeps", function() {
    it("Should be able to execute creep roles", function() {
        var counter = 0;

        global.AI = {
            extensions: {
                roles: {
                    creepRole1: {
                        turn: function() {}
                    },
                    creepRole2: {
                        turn: function() {}
                    }
                }
            },
            getTimeDiff: function(start, stop) {
                return stop - start;
            }
        };

        global.Memory = {
            creeps: {
                creepA: {
                    role: "creepRole2"
                },
                creepB: {
                    role: "creepRole1"
                }
            }
        };

        global.Game = {
            creeps: {
                creepA: {
                    get memory() {
                        return Memory.creeps.creepA;
                    }
                },
                creepB: {
                    get memory() {
                        return Memory.creeps.creepB;
                    }
                }
            },
            getUsedCpu: function() {
                var result = counter;
                counter++;

                return result;
            }
        };

        var fn1 = simple.mock(AI.extensions.roles.creepRole1, "turn");
        var fn2 = simple.mock(AI.extensions.roles.creepRole2, "turn");

        var result = creepsScript();

        assert.strictEqual(fn1.callCount, 1);
        assert.strictEqual(fn2.callCount, 1);
    });

    it("Should call endTurn once each role", function() {
        var counter = 0;

        global.AI = {
            extensions: {
                roles: {
                    creepRole3: {
                        turn: function() {},
                        endTurn: function() {},
                    },
                    creepRole4: {
                        turn: function() {},
                        endTurn: function() {}
                    }
                }
            },
            getTimeDiff: function(start, stop) {
                return stop - start;
            }
        };

        global.Memory = {
            creeps: {
                creepC: {
                    role: "creepRole3"
                },
                creepD: {
                    role: "creepRole3"
                }
            }
        };

        global.Game = {
            creeps: {
                creepC: {
                    get memory() {
                        return Memory.creeps.creepC;
                    }
                },
                creepD: {
                    get memory() {
                        return Memory.creeps.creepD;
                    }
                }
            },
            getUsedCpu: function() {
                var result = counter;
                counter++;

                return result;
            }
        };

        var fn1a = simple.mock(AI.extensions.roles.creepRole3, 'turn');
        var fn1b = simple.mock(AI.extensions.roles.creepRole3, 'endTurn');
        var fn2a = simple.mock(AI.extensions.roles.creepRole4, 'turn');
        var fn2b = simple.mock(AI.extensions.roles.creepRole4, 'endTurn');

        var result = creepsScript();

        assert.strictEqual(fn1a.callCount, 2);
        assert.strictEqual(fn1b.callCount, 1);
        assert.strictEqual(fn2a.callCount, 0);
        assert.strictEqual(fn2b.callCount, 1);
    });

    it("Should call spawning if creep is still spawning", function() {
        var counter = 0;

        global.AI = {
            extensions: {
                roles: {
                    creepRole5: {
                        spawning: function() {},
                        turn: function() {},
                    }
                }
            },
            getTimeDiff: function(start, stop) {
                return stop - start;
            }
        };

        global.Memory = {
            creeps: {
                creepE: {
                    role: "creepRole5"
                }
            }
        };

        global.Game = {
            creeps: {
                creepE: {
                    spawning: true,
                    get memory() {
                        return Memory.creeps.creepE;
                    }
                }
            },
            getUsedCpu: function() {
                var result = counter;
                counter++;

                return result;
            }
        };

        var fn1 = simple.mock(AI.extensions.roles.creepRole5, 'spawning');
        var fn2 = simple.mock(AI.extensions.roles.creepRole5, 'turn');

        var result = creepsScript();

        assert.strictEqual(fn1.callCount, 1);
        assert.strictEqual(fn2.callCount, 0);
    });

    it("Should fail executing a creep when there is no role and no hook to recover the creep", function() {
        var counter = 0;

        global.AI = {
            emit: lib.emit,
            extensions: {
                roles: {
                    creepRole6: {
                        turn: function() {},
                    }
                }
            },
            getTimeDiff: function(start, stop) {
                return stop - start;
            }
        };

        global.Memory = {
            creeps: {
                creepF: {
                    role: "creepRoleUnexisting"
                }
            }
        };

        global.Game = {
            creeps: {
                creepF: {
                    get memory() {
                        return Memory.creeps.creepF;
                    },
                    name: "creepF",
                    pos: {
                        roomName: "test",
                        x: 10,
                        y: 11
                    }
                }
            },
            getUsedCpu: function() {
                var result = counter;
                counter++;

                return result;
            }
        };

        var fn1 = simple.mock(AI.extensions.roles.creepRole6, 'turn');

        var execute = function() {
            var result = creepsScript();
        };

        var buffer = [];
        lib.bufferConsole(execute, buffer);

        assert.deepEqual(buffer, [["Warning: Creep creepF without role at 10,11 in room test"]]);
        assert.strictEqual(fn1.callCount, 0);
    });

    it("Should call noRole if creep has no role", function() {
        var counter = 0;

        global.AI = {
            emit: lib.emit,
            extensions: {
                roles: {
                    creepRole7: {
                        turn: function() {},
                    }
                },
                hooks: {
                    aHook: {
                        noRole: function() {
                            return;
                        }
                    },
                    bHook: {
                        noRole: function() {
                            return "creepRole7";
                        }
                    },
                    cHook: {
                        noRole: function() {
                            return 123;
                        }
                    }
                }
            },
            getTimeDiff: function(start, stop) {
                return stop - start;
            }
        };

        global.Memory = {
            creeps: {
                creepG: {}
            }
        };

        global.Game = {
            creeps: {
                creepG: {
                    get memory() {
                        return Memory.creeps.creepG;
                    },
                    name: "creepG",
                    pos: {
                        roomName: "test",
                        x: 43,
                        y: 35
                    }
                }
            },
            getUsedCpu: function() {
                var result = counter;
                counter++;

                return result;
            }
        };

        var fn1 = simple.mock(AI.extensions.roles.creepRole7, 'turn');
        var fnHook1 = simple.mock(AI.extensions.hooks.aHook, 'noRole');
        var fnHook2 = simple.mock(AI.extensions.hooks.bHook, 'noRole');
        var fnHook3 = simple.mock(AI.extensions.hooks.cHook, 'noRole');

        var execute = function() {
            var result = creepsScript();
        };

        var buffer = [];
        lib.bufferConsole(execute, buffer);

        assert.deepEqual(buffer, []);
        assert.strictEqual(fn1.callCount, 1);
        assert.strictEqual(fnHook1.callCount, 1);
        assert.strictEqual(fnHook2.callCount, 1);
        assert.strictEqual(fnHook3.callCount, 1);
    });

    it("Should throw an error if noCall hooks return conflicting results", function() {
        var counter = 0;

        global.AI = {
            emit: lib.emit,
            extensions: {
                hooks: {
                    dHook: {
                        noRole: function() {
                            return "thisRole";
                        }
                    },
                    eHook: {
                        noRole: function() {
                            return "thatRole";
                        }
                    }
                }
            },
            getTimeDiff: function(start, stop) {
                return stop - start;
            }
        };

        global.Memory = {
            creeps: {
                creepH: {}
            }
        };

        global.Game = {
            creeps: {
                creepH: {
                    get memory() {
                        return Memory.creeps.creepH;
                    },
                    name: "creepF",
                    pos: {
                        roomName: "test",
                        x: 15,
                        y: 35
                    }
                }
            },
            getUsedCpu: function() {
                var result = counter;
                counter++;

                return result;
            }
        };

        var fn1 = simple.mock(AI.extensions.hooks.dHook, 'noRole');
        var fn2 = simple.mock(AI.extensions.hooks.eHook, 'noRole');

        var execute = function() {
            var result = creepsScript();
        };

        var buffer = [];
        lib.bufferConsole(execute, buffer);

        assert.deepEqual(buffer, [["Warning: Creep creepF has been assigned with multiple roles"]]);
        assert.strictEqual(fn1.callCount, 1);
        assert.strictEqual(fn2.callCount, 1);
    });
});