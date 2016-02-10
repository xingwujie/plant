import _ from 'lodash';
import * as api from '../../../app/middleware/api';
import * as ajax from '../../../app/middleware/ajax';
import assert from 'assert';
import sinon from 'sinon';

describe('/app/middleware/api', function() {

  it('should check that functions/url exist', done => {
    const store = {};
    const action = {
      payload: {_id: '123'}
    };
    const next = () => {};

    const stub = sinon.stub(ajax, 'default', (state, options) => {
      const message = JSON.stringify(options);
      assert(_.isString(options.url), `Missing url: ${message}`);
      assert(_.isFunction(options.success), `Missing success fn: ${message}`);
      assert(_.isFunction(options.failure), `Missing failure fn: ${message}`);
    });

    _.each(api.apis, (v, k) => {
      api.default(store)(next)({...action, type: k});
    });

    assert.equal(stub.callCount, Object.keys(api.apis).length);

    ajax.default.restore();
    done();
  });

  it('should check that next gets called if no match', done => {
    const store = {};
    const action = {
      payload: {_id: '123'}
    };
    let nextCalled = false;
    const next = () => {
      nextCalled = true;
    };

    const spy = sinon.spy(ajax, 'default');

    api.default(store)(next)({...action, type: 'Does not exist'});

    assert(nextCalled);
    assert.equal(spy.callCount, 0);

    ajax.default.restore();
    done();
  });

});
