// import _ from 'lodash';
import * as actions from '../../../app/actions';
import assert from 'assert';
// import d from 'debug';

// const debug = d('plant:test.actions');

describe('/app/actions', function() {

  it('should create a logout action', (done) => {
    const expected = {
      type: actions.LOGOUT
    };
    const actual = actions.logout();
    assert.deepEqual(actual, expected);
    done();
  });

  it('should create a login request action', (done) => {
    const payload = {one: 1, two: 2};
    const expected = {
      type: actions.LOGIN_REQUEST,
      payload
    };
    const actual = actions.loginRequest(payload);
    assert.deepEqual(actual, expected);
    done();
  });

  it('should create a login failure action', (done) => {
    const payload = {one: 1, two: 2};
    const expected = {
      type: actions.LOGIN_FAILURE,
      payload,
      error: true
    };
    const actual = actions.loginFailure(payload);
    assert.deepEqual(actual, expected);
    done();
  });


});
