import assert from 'assert';
import moment from 'moment';
import proxyquire from 'proxyquire';

// import d from 'debug';
// const debug = d('plant:test.ajax');

const ajaxStub = {
  'jquery': {}
};

const ajax = proxyquire('../../../app/middleware/ajax', ajaxStub);

describe('/app/middleware/ajax', function() {

  it('should confirm that moment objects are formatted', done => {

    const store = {};
    const options = {
      url: '/something',
      success: () => {},
      failure: () => {},
      data: {
        _id: '123',
        testDate: moment(new Date(2015, 4, 5))
      },
      type: 'POST'
    };

    let jqueryAjaxCalled = false;

    ajaxStub.jquery.ajax = opts => {
      assert.equal(opts.data._id, opts.data._id);
      assert.equal(opts.data.testDate, '05/05/2015');
      jqueryAjaxCalled = true;
    };

    ajax.default(store, options);

    assert(jqueryAjaxCalled);

    done();
  });

});
