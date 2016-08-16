import mongo from '../../../../lib/db/mongo';
import assert from 'assert';
import constants from '../../../../app/libs/constants';
import {makeMongoId} from '../../../../app/libs/utils';

import d from 'debug';
const debug = d('plant:test.mongo');

describe('/lib/db/mongo/', function() {
  this.timeout(10000);
  let userId;

  describe('user', () => {

    const facebookId = makeMongoId();
    // let createdUser;

    const fbUser = {
      facebook: {
        id: facebookId,
        gender: 'male',
        link: 'https://www.facebook.com/app_scoped_user_id/1234567890123456/',
        locale: 'en_US',
        last_name: 'Smith', // eslint-disable-line camelcase
        first_name: 'John', // eslint-disable-line camelcase
        timezone: -7,
        updated_time: '2015-01-29T23:11:04+0000', // eslint-disable-line camelcase
        verified: true
      },
      name: 'John Smith',
      email: 'test@test.com',
      createdAt: '2016-01-28T14:59:32.989Z',
      updatedAt: '2016-01-28T14:59:32.989Z'
    };

    it('should create a user account if everything is present', (done) => {
      assert(!fbUser._id);
      mongo.findOrCreateFacebookUser(fbUser, (err, body) => {
        debug('body:', body);

        assert(!err);
        assert(body);
        assert(body._id);
        assert(constants.mongoIdRE.test(body._id));
        assert.equal(body, fbUser);

        assert(fbUser._id);
        userId = body._id;

        done();
      });
    });

    it('should fetch the just-created user', (done) => {

      const user = {
        facebook: {
          id: facebookId
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
        assert.equal(result.userid, plant.userId);
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
