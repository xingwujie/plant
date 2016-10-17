const _ = require('lodash');
const mongo = require('../../../../lib/db/mongo');
const assert = require('assert');
const constants = require('../../../../app/libs/constants');
const helper = require('../../../helper');

// const logger = require('../../../../lib/logging/logger').create('test.mongo-index');

describe('/lib/db/mongo/', function() {
  this.timeout(10000);
  let userId;
  let fbUser;

  before('should create a user account by starting the server', (done) => {
    helper.startServerAuthenticated((err, data) => {
      assert(!err);
      fbUser = data.user;
      userId = fbUser._id;
      assert(userId);
      assert.equal(typeof userId, 'string');
      Object.freeze(fbUser);
      done();
    });
  });

  describe('user', () => {
    it('should fail to create a user account if there is no object', (done) => {

      mongo.findOrCreateUser(null, (err, body) => {
        assert(err);
        assert.equal(err.message, 'No facebook.id or google.id:');
        assert(!body);

        done();
      });
    });

    it('should fetch the user created in the before setup', (done) => {

      const user = {
        facebook: {
          id: fbUser.facebook.id
        },
      };
      mongo.findOrCreateUser(user, (err, body) => {
        assert(!err);
        assert(body);
        assert(body._id);
        assert(constants.mongoIdRE.test(body._id));
        assert.deepStrictEqual(body, fbUser);

        done();
      });
    });

    it('should fetch all users', (done) => {

      mongo.getAllUsers((err, body) => {
        assert(!err);
        assert(body);
        assert(_.isArray(body));
        assert.equal(body.length, 1);
        const user = body[0];
        assert(user._id);
        assert(constants.mongoIdRE.test(user._id));

        done();
      });
    });

  });

  describe('plant', () => {
    const plant = {
      name: 'Plant Name',
      plantedOn: 20150701
    };
    let plantId;

    it('should create a plant', (done) => {
      plant.userId = userId;
      assert.equal(typeof plant.userId, 'string');
      mongo.createPlant(plant, (createPlantErr, body) => {
        assert(!createPlantErr);
        assert(body);
        assert(body._id);
        assert.equal(typeof body._id, 'string');
        assert.equal(typeof body.userId, 'string');
        assert.equal(typeof plant.userId, 'object');
        assert.equal(typeof plant.plantedOn, 'number');

        // To be used in next test...
        plantId = body._id;

        done();
      });
    });

    it('should get an existing plant', (done) => {

      mongo.getPlantById(plantId, (err, result) => {
        assert.equal(typeof result.userId, 'string');
        assert(!err);
        assert.equal(result.name, plant.name);
        assert.equal(result.plantedOn, plant.plantedOn);
        assert.equal(result.userId, plant.userId.toString());
        done();
      });
    });

    it('should get existing plants', (done) => {
      mongo.getPlantsByIds([plantId], (err, results) => {
        assert(!err);
        assert(_.isArray(results));
        assert.equal(results.length, 1);
        const result = results[0];
        assert.equal(typeof result.userId, 'string');
        assert.equal(result.name, plant.name);
        assert.equal(result.plantedOn, plant.plantedOn);
        assert.equal(result.userId, plant.userId.toString());
        done();
      });
    });

    it('should update an existing plant with "Set"', (done) => {

      const plantUpdate = {
        name: 'New Name',
        other: 'Other Text',
        _id: plantId,
        userId
      };

      mongo.updatePlant(plantUpdate, (err, result) => {
        assert(!err);
        assert.equal(result.ok, 1);
        // Mongo 2.x does not return nModified which is what Travis uses so do not check this
        // assert.equal(result.nModified, 1);
        assert.equal(result.n, 1);
        done();
      });
    });

  });
});
