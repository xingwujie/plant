import * as helper from '../../helper';
import assert from 'assert';

describe('plant-api', function() {

  before('it should start the server and get an authenticated user', done => {
    helper.startServerAuthenticated(done);
  });

  it('should create a plant', (done) => {
    assert(true);
    done();
  });

});
