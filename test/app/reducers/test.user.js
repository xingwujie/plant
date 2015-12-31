import user from '../../../app/reducers/user';
import * as actions from '../../../app/actions';
import assert from 'assert';

describe('/app/reducers/user', function() {

  it('should reduce a logout action', (done) => {
    const expected = {};
    const actual = user({}, actions.logout());
    assert.deepEqual(actual, expected);
    done();
  });

  it('should reduce a login request', (done) => {
    const payload = {one: 1, two: 2};
    const expected = {
      status: 'fetching'
    };
    const actual = user({}, actions.loginRequest(payload));
    assert.deepEqual(actual, expected);
    done();
  });

  it('should reduce a login success', (done) => {
    const payload = {one: 1, two: 2};
    const expected = Object.assign({
      status: 'success',
      isLoggedIn: true
    }, payload);
    const actual = user({}, actions.loginSuccess(payload));
    assert.deepEqual(actual, expected);
    done();
  });

  it('should reduce a login failure', (done) => {
    const payload = {one: 1, two: 2};
    const expected = Object.assign({
      status: 'failed',
      isLoggedIn: false
    }, payload);
    const actual = user({}, actions.loginFailure(payload));
    assert.deepEqual(actual, expected);
    done();
  });

});
