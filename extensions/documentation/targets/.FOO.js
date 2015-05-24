'use strict';

// Filtering done relative to given object
function filter(creep, options) {
    options = options || {};

    return {
        filter: function(target) {
            // Insert code
        }
    };
}

// Filtering done on global level
function find(options) {
    options = options || {};

    return {
        filter: function(target) {

        }
    };
}

// Room === undefined -> get all
// Otherwise, only get result from given room
function get(room, option) {

}

module.exports = {
    filter: filter,
    find: find,
    get: get
};
