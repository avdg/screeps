'use strict';

/* globals performance:true*/
var time = typeof performance === 'object' && performance.now ? performance.now() : new Date();

Game.getUsedCpu = function() {
    return typeof performance === 'object' && performance.now ? performance.now() - time : Date.now() - time;
};