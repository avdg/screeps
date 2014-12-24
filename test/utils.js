var assert = require('assert');

function reset() {
    require('../lib/mocks/gameStateStart');
}
reset();

var utils = require('../scripts/_utils');
beforeEach(reset); // resets once before every global describe

describe('getCreepCost', function() {
    it('Should return an number when giving an array of body parts', function() {
        assert.equal("number", typeof utils.getCreepCost([Game.TOUGH]));
    });
});
