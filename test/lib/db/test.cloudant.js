import { createDesigns } from '../../helper';
import * as Plant from '../../../lib/db/plant-db';
import * as User from '../../../lib/db/user-db';
import assert from 'assert';
import d from 'debug';

const debug = d('plant:test.cloudant');

describe('/db/cloudant/', function() {
  this.timeout(10000);

  before((done) => {
    createDesigns(done);
  });

  var userId;

  describe('/user/', function() {
    // TODO: This should be in a setup helper
    it('should create a user account', (done) => {
      const userDB = new User.User();

      const user = {
        facebook: {
          id: 'e2f80b715c65e35328305ac68ad32255'
        },
        email: '',
        first: 'first',
        last: 'last'
      };

      userDB.findOrCreateFacebookUser(user, (err, body) => {

        assert(!err);
        debug('body:', body);
        assert(body);
        assert(body._id);
        assert.equal(body.type, 'user');
        assert.equal(body.email, user.email);
        assert.equal(body.first, user.first);

        userId = body._id;

        done();
      });
    });
  });

  describe('/plant/', function() {
    const plantDB = new Plant.Plant();
    const plant = {
      name: 'Plant Name',
      plantedOn: new Date(2015, 7, 1),
      userId: userId
    };

    it('should create a plant', (done) => {

      plantDB.create(plant, (err, body) => {

        assert(!err);
        assert(body);
        assert(body.id);

        plant.id = body.id;

        done();
      });
    });

    it('should get an existing plant', (done) => {

      plantDB.getById(plant.id, (err, result) => {

        assert(!err);
        assert(result);
        assert.equal(result.name, plant.name);
        const plantedOn = new Date(result.plantedOn);
        assert.equal(plantedOn.getTime(), plant.plantedOn.getTime());
        assert.equal(result.userid, plant.userId);
        done();
      });
    });

    it('should update an existing plant with "Set"', (done) => {

      const plantUpdate = {
        name: 'New Name',
        other: 'Other Text'
      };

      plantDB.updateSet(plantUpdate, plant.id, (err, result) => {

        assert(!err);
        assert(result.ok);
        assert.equal(result.id, plant.id);

        plantDB.getById(plant.id, (err2, result2) => {

          debug('update result:', result2);

          // Has name changed?
          assert.equal(result2.name, plantUpdate.name);

          // Did plantedOn date remain the same?
          const plantedOn = new Date(result2.plantedOn);
          assert.equal(plantedOn.getTime(), plant.plantedOn.getTime());

          // Was other added?
          assert.equal(result2.other, plantUpdate.other);

          done();
        });
      });
    });

    it('should update an existing plant with Wholesale replacement', (done) => {

      const plantUpdate = {
        name: 'New Name',
        other2: 'Other Text'
      };

      plantDB.update(plantUpdate, plant.id, (err, result) => {

        assert(!err);
        assert(result.ok);
        assert.equal(result.id, plant.id);

        plantDB.getById(plant.id, (err2, result2) => {

          debug('update result:', result2);

          // Has name changed?
          assert.equal(result2.name, plantUpdate.name);

          // Were plantedOn and other removed?
          assert(!result2.plantedOn);
          assert(!result2.other);

          // Was other2 added?
          assert.equal(result2.other2, plantUpdate.other2);

          done();
        });
      });
    });

  });

});
