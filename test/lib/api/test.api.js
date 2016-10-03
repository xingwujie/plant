const _ = require('lodash');
import * as helper from '../../helper';
import assert from 'assert';

import d from 'debug';
const debug = d('plant:test.plants-api');

describe('api', function() {
  this.timeout(10000);

  before('it should start the server and setup auth token', done => {
    helper.startServerAuthenticated((err, data) => {
      assert(data.userId);
      done();
    });
  });

  it('should get a 404 if the path is not recognized', done => {
    const reqOptions = {
      method: 'GET',
      authenticate: false,
      json: true,
      url: '/unknown'
    };

    helper.makeRequest(reqOptions, (error, httpMsg, response) => {
      assert(!error, error);
      assert.equal(httpMsg.statusCode, 404);
      const docType = '<!DOCTYPE html>';
      debug('response:', response);
      assert(_.includes(response, docType), `Expected ${response} to have ${docType}`);

      done();
    });
  });

});
