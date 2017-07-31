const helper = require('../../helper');
const assert = require('assert');

const logger = require('../../../lib/logging/logger').create('test.plants-api');

describe('plants-api', () => {
  let userId;
  let locationId;

  before('it should start the server and setup auth token', (done) => {
    helper.startServerAuthenticated((err, data) => {
      assert(data.user);
      assert(data.user._id);
      assert(data.user.locationIds);
      assert(data.user.locationIds.length);
      userId = data.user._id;
      locationId = data.user.locationIds[0]._id;
      done();
    });
  });

  let insertedPlants;
  const numPlants = 2;

  before('should create multiple plants to use in test', (done) => {
    helper.createPlants(numPlants, userId, locationId, (err, plants) => {
      insertedPlants = plants;
      done();
    });
  });

  describe('plants by locationId', () => {
    // it('should return an empty list if locationId exists and has no plants');

    it('should retrieve the just created plants by locationId', (done) => {
      const reqOptions = {
        method: 'GET',
        authenticate: false,
        json: true,
        url: `/api/plants/${locationId}`,
      };

      helper.makeRequest(reqOptions, (error, httpMsg, response) => {
        logger.trace('response:', { response });
        assert(!error);
        assert.equal(httpMsg.statusCode, 200);
        assert(response);

        assert.equal(response.length, numPlants);
        // assert that all plants exist
        insertedPlants.forEach((plant) => {
          const some = response.some(r => r._id === plant._id);
          assert(some);
        });

        done();
      });
    });
  });

  describe('failures', () => {
    it('should get a 404 if there is no locationId', (done) => {
      const reqOptions = {
        method: 'GET',
        authenticate: false,
        json: true,
        url: '/api/plants',
      };

      helper.makeRequest(reqOptions, (error, httpMsg, response) => {
        assert(!error);
        assert.equal(httpMsg.statusCode, 404);
        assert(response);

        done();
      });
    });

    it('should fail to retrieve any plants if the locationId does not exist', (done) => {
      const reqOptions = {
        method: 'GET',
        authenticate: false,
        json: true,
        url: '/api/plants/does-not-exist',
      };
      helper.makeRequest(reqOptions, (error, httpMsg, response) => {
        assert(!error);
        assert.equal(httpMsg.statusCode, 404);
        assert(!response);

        done();
      });
    });
  });
});
