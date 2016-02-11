import _ from 'lodash';
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

  it('should return an object if data is falsey', done => {

    const store = {};
    const options = {
      url: '/something',
      success: () => {},
      failure: () => {},
      data: null,
      type: 'POST'
    };

    let jqueryAjaxCalled = false;

    ajaxStub.jquery.ajax = opts => {
      assert(_.isObject(opts.data));
      jqueryAjaxCalled = true;
    };

    ajax.default(store, options);

    assert(jqueryAjaxCalled);

    done();
  });

  it('should confirm that moment objects are formatted', done => {

    const store = {};
    const options = {
      url: '/something',
      success: () => {},
      failure: () => {},
      data: {
        _id: '123',
        date: moment(new Date(2015, 4, 5)),
        one: {
          fooone: 'bar',
          date: moment(new Date(2015, 4, 5)),
          two: {
            footwo: 'baz',
            date: moment(new Date(2015, 4, 5)),
          }
        }
      },
      type: 'POST'
    };

    let jqueryAjaxCalled = false;

    ajaxStub.jquery.ajax = opts => {
      assert.equal(opts.data._id, opts.data._id);
      assert.equal(opts.data.date, '05/05/2015');
      assert.equal(opts.data.one.fooone, 'bar');
      assert.equal(opts.data.one.date, '05/05/2015');
      assert.equal(opts.data.one.two.date, '05/05/2015');
      assert.equal(opts.data.one.two.footwo, 'baz');
      jqueryAjaxCalled = true;
    };

    ajax.default(store, options);

    assert(jqueryAjaxCalled);

    done();
  });

  it('should format moment if that is the object', done => {

    const store = {};
    const options = {
      url: '/something',
      success: () => {},
      failure: () => {},
      data: moment(new Date(2015, 4, 5)),
      type: 'POST'
    };

    let jqueryAjaxCalled = false;

    ajaxStub.jquery.ajax = opts => {
      assert.equal(opts.data, '05/05/2015');
      jqueryAjaxCalled = true;
    };

    ajax.default(store, options);

    assert(jqueryAjaxCalled);

    done();
  });

  it('should format moment objects in arrays', done => {

    const store = {};
    const options = {
      url: '/something',
      success: () => {},
      failure: () => {},
      data: [{
        date: moment(new Date(2015, 4, 5)),
        one: [{
          date: moment(new Date(2015, 4, 5)),
        }]
      }],
      type: 'POST'
    };

    let jqueryAjaxCalled = false;

    ajaxStub.jquery.ajax = opts => {
      assert.equal(opts.data[0].date, '05/05/2015');
      assert.equal(opts.data[0].one[0].date, '05/05/2015');
      jqueryAjaxCalled = true;
    };

    ajax.default(store, options);

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

    ajax.default(store, options);

    assert(jqueryAjaxCalled);

    done();
  });

});
