import mongo from '../../../../lib/db/mongo';
import assert from 'assert';
import constants from '../../../../app/libs/constants';
import helper from '../../../helper';

// import d from 'debug';
// const debug = d('plant:test.mongo');

describe('/lib/db/mongo/', function() {
  this.timeout(10000);
  let userId;

  describe('user', () => {

    let fbUser;
    before('should create a user account through the helper', (done) => {
      helper.createUser((err, user) => {
        fbUser = user;
        done();
      });
    });


    it('should fetch the just-created user', (done) => {

      const user = {
        facebook: {
          id: fbUser.facebook.id
        },
      };

      mongo.findOrCreateFacebookUser(user, (err, body) => {
        // TODO: This test is WIP
        assert(!err);
        assert(body);
        assert(body._id);
        assert(constants.mongoIdRE.test(body._id));
        assert.deepStrictEqual(body, fbUser);

        done();
      });
    });

    it('should fail to create a user account if there is no object', (done) => {

      mongo.findOrCreateFacebookUser(null, (err, body) => {

        assert(err);
        assert.equal(err.message, 'No facebook.id:');
        assert(!body);

        done();
      });
    });
  });

  describe('plant', () => {
    const plant = {
      name: 'Plant Name',
      plantedOn: new Date(2015, 7, 1),
      userId
    };

    it('should create a plant', (done) => {
      mongo.createPlant(plant, (err, body) => {

        assert(!err);
        assert(body);
        assert(body._id);
        assert(plant._id);

        done();
      });
    });

    it('should get an existing plant', (done) => {

      mongo.getPlantById(plant._id, (err, result) => {

        assert(!err);
        assert(result);
        assert.equal(result.name, plant.name);
        const plantedOn = new Date(result.plantedOn);
        assert.equal(plantedOn.getTime(), plant.plantedOn.getTime());
        assert.equal(result.userId, plant.userId);
        done();
      });
    });

    it('should update an existing plant with "Set"', (done) => {

      const plantUpdate = {
        name: 'New Name',
        other: 'Other Text',
        _id: plant._id
      };

      mongo.updatePlant(plantUpdate, (err, result) => {

        assert(!err);
        assert.equal(result.matchedCount, 1);
        assert.equal(result.modifiedCount, 1);
        done();
      });
    });

  });
});
