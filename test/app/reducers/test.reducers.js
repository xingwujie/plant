const rootReducer = require('../../../app/reducers');
const actions = require('../../../app/actions');
const assert = require('assert');
const Immutable = require('immutable');

describe('/app/reducers', function() {

  it('should reduce a logout action', (done) => {
    const expected = {
      notes: {},
      plants: {},
      user: {},
      users: {},
      interim: {}
    };
    const actual = rootReducer(new Immutable.Map(), actions.logout());
    assert.deepEqual(actual.toJS(), expected);
    done();
  });

});
