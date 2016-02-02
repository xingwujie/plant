import * as helper from '../../helper';
import assert from 'assert';

describe('plant-api', function() {
  this.timeout(10000);

  let server;
  let user;
  before('it should start the server and get an authenticated user', done => {
    helper.startServerAuthenticated((err, serverAndUser) => {
      assert(!err);
      server = serverAndUser.server;
      user = serverAndUser.user;
      done();
    });
  });

  it('should create a plant', (done) => {

    done();
  });

});
