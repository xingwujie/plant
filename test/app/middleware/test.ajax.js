const _ = require('lodash');
import assert from 'assert';
import proxyquire from 'proxyquire';

// const logger = require('../../../lib/logging/logger').create('test.ajax');

const ajaxStub = {
  'jquery': {}
};

const ajax = proxyquire('../../../app/middleware/ajax', ajaxStub);

describe('/app/middleware/ajax', function() {

  it('should return an object if data is object', done => {

    const store = {};
    const options = {
      url: '/something',
      success: () => {},
      failure: () => {},
      data: {},
      type: 'POST'
    };

    let jqueryAjaxCalled = false;

    ajaxStub.jquery.ajax = opts => {
      assert(_.isObject(opts.data));
      jqueryAjaxCalled = true;
    };

    ajax(store, options);

    assert(jqueryAjaxCalled);

    done();
  });

  it('should not change a native data type', done => {

    const store = {};
    const options = {
      url: '/something',
      success: () => {},
      failure: () => {},
      data: 'do not change me',
      type: 'POST'
    };

    let jqueryAjaxCalled = false;

    ajaxStub.jquery.ajax = opts => {
      assert.equal(opts.data, 'do not change me');
      jqueryAjaxCalled = true;
    };

    ajax(store, options);

    assert(jqueryAjaxCalled);

    done();
  });

});
