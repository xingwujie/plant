import {db} from '../../../lib/db';

describe('/db/cloudant/', function() {
  this.timeout(5000);

  it('should create a user account', (done) => {

    const user = {
      email: 'test@test.com',
      first: 'first',
      last: 'last'
    };

    db.createUser(user, (err, body) => {
      // TODO: Add some asserts here.
      console.log(body);
      done();
    });
  });

});
