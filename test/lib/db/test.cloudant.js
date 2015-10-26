import {User, Plant} from '../../../lib/db';
import assert from 'assert';

describe('/db/cloudant/', function() {
  this.timeout(5000);

  var userId;
  var plantId;

  it('should create a user account', (done) => {
    const userDB = new User();

    const user = {
      email: 'test@test.com',
      first: 'first',
      last: 'last'
    };

    userDB.findOrCreateUser(user, (err, body) => {

      assert(!err);
      assert(body);
      assert(body._id);
      assert.equal(body.type, 'user');
      assert.equal(body.email, user.email);
      assert.equal(body.first, user.first);

      userId = body._id;

      done();
    });
  });

  it('should create a plant', (done) => {
    const plantDB = new Plant();

    const plant = {
      name: 'Plant Name',
      plantedOn: new Date(2015, 7, 1)
    };

    plantDB.create(userId, plant, (err, body) => {

      assert(!err);
      assert(body);
      // console.log('body:', body);
      assert(body.id);
      // assert.equal(body.type, 'plant');
      // assert.equal(body.name, plant.name);
      // assert.equal(body.plantedOn, plant.plantedOn);

      plantId = body.id;

      done();
    });
  });

});
