import _ from 'lodash';
import * as api from '../../../app/middleware/api';
import * as ajax from '../../../app/middleware/ajax';
import assert from 'assert';
import sinon from 'sinon';

describe('/app/middleware/api', function() {

  it('should check that functions/url exist', (done) => {
    const store = {};
    const action = {
      payload: {_id: '123'}
    };
    const next = () => {};

    sinon.stub(ajax, 'default', (s, a, options) => {
      const message = JSON.stringify(options);
      assert(_.isString(options.url), `Missing url: ${message}`);
      assert(_.isFunction(options.success), `Missing success fn: ${message}`);
      assert(_.isFunction(options.failure), `Missing failure fn: ${message}`);
    });

    _.each(api.apis, v => {
      v(store, action, next);
    });

    ajax.default.restore();
    done();
  });

});
