import * as helper from '../../helper';
import assert from 'assert';

import d from 'debug';
const debug = d('plant:test.plant-api');

describe('plant-api', function() {
  this.timeout(10000);

  before('it should start the server and get an authenticated user', done => {
    helper.startServerAuthenticated((err) => {
      assert(!err);
      done();
    });
  });

  it('should create a plant', (done) => {
    const plant = {
      title: 'Plant Title'
    };
    const reqOptions = {
      method: 'POST',
      authenticated: true,
      body: plant,
      json: true,
      url: '/api/plant'
    };
    helper.makeRequest(reqOptions, (error, httpMsg, response) => {
      debug('response:', response);
      assert(!error);
      assert(httpMsg.statusCode, 200);
      assert(response);
      done();
    });
  });

});
