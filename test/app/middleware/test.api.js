import _ from 'lodash';
import * as actions from '../../../app/actions';
import assert from 'assert';
import proxyquire from 'proxyquire';

let ajax = () => {};
const mockAjax = (store, options) => {
  ajax(store, options);
};

const api = proxyquire('../../../app/middleware/api', {
  './ajax': mockAjax
});

// const logger = require('../../../lib/logging/logger').create('test.api');

describe('/app/middleware/api', function() {

  it('should check that functions/url exist', () => {
    const store = {};
    const next = () => {};
    let callCounter = 0;

    ajax = (state, options) => {
      const message = JSON.stringify(options);
      assert(_.isString(options.url), `Missing url: ${message}`);
      assert(_.isFunction(options.success), `Missing success fn: ${message}`);
      assert(_.isFunction(options.failure), `Missing failure fn: ${message}`);
      callCounter++;
    };

    Object.keys(api.apis).forEach(key => {
      const action = {payload: {_id: '123'}};

      api.default(store)(next)({...action, type: key});
    });

    assert.equal(callCounter, Object.keys(api.apis).length);

  });

  it('should check that upsertNoteRequest calls saveNoteRequest when files is present', () => {
    const store = {};
    const next = () => {};
    let callCounter = 0;
    ajax = (state, options) => {
      assert.equal(options.contentType, 'multipart/form-data');
      assert(_.isFunction(options.data.append));
      assert(_.isFunction(options.failure));
      assert(_.isFunction(options.success));
      assert.equal(options.type, 'POST');
      assert.equal(options.url, '/api/upload');
      assert.equal(options.fileUpload, true);
      callCounter++;
    };

    const action = {
      payload: {
        note: {_id: '123'},
        files: [{}]
      },
      type: actions.UPSERT_NOTE_REQUEST
    };

    api.default(store)(next)(action);

    assert.equal(callCounter, 1);
  });

  it('should check that next gets called if no match', () => {
    const store = {};
    const action = {
      payload: {_id: '123'}
    };
    let nextCalled = false;
    const next = () => {
      nextCalled = true;
    };

    api.default(store)(next)({...action, type: 'Does not exist'});

    assert(nextCalled);
  });

});
