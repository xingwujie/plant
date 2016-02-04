import * as helper from '../../helper';
import assert from 'assert';
import async from 'async';

import d from 'debug';
const debug = d('plant:test.plants-api');

describe.skip('plants-api', function() {
  this.timeout(10000);
  let userId;

  before('it should start the server and setup auth token', done => {
    helper.startServerAuthenticated((err, data) => {
      assert(data.userId);
      userId = data.userId;
      done();
    });
  });

  before('it should clear all plants for this user from DB', done => {
    helper.deleteAllPlantsForUser(done);
  });

  const initialPlant = {
    title: 'Plant Title',
    userId
  };
  let insertedPlants;
  const numPlants = 2;

  before('should create multiple plants to use in test', (done) => {

    var createPlant = function(id, callback) {
      const reqOptions = {
        method: 'POST',
        authenticate: true,
        body: {...initialPlant, title: `${initialPlant.title} ${id}`},
        json: true,
        url: '/api/plant'
      };

      helper.makeRequest(reqOptions, (error, httpMsg, response) => {
        assert(!error);
        assert.equal(httpMsg.statusCode, 200);
        assert(response.ok);

        callback(null, {
          ...reqOptions.body,
          _id: response.id
        });
      });
    };

    // generate some plants
    async.times(numPlants, (n, next) => {
      createPlant(n, (err, plant) => {
        next(err, plant);
      });
    }, function(err, plants) {
      assert(!err);
      // we should now have 2 plants
      debug('async.times:', plants);
      assert.equal(plants.length, numPlants);
      insertedPlants = plants;
      done();
    });

  });

  it('should retrieve the just created plants by userId', (done) => {
    const reqOptions = {
      method: 'GET',
      authenticate: false,
      json: true,
      url: `/api/plants/${userId}`
    };

    helper.makeRequest(reqOptions, (error, httpMsg, response) => {
      debug(response);
      // response should look like:
      // ?
      assert(!error);
      assert.equal(httpMsg.statusCode, 200);
      assert(response);
      assert.equal(response.length, numPlants);
      // assert that all plants exist
      insertedPlants.forEach( plant => {
        const some = response.some( r => {
          return r._id === plant._id;
        });
        assert(some);
      });
      // assert(response.userId);
      // assert.equal(response._id, plantId);
      // assert.equal(response.title, initialPlant.title);
      // assert.equal(response.type, 'plant');

      done();
    });

  });

  it('should fail to retrieve any plants if the userId does not exist', (done) => {
    const reqOptions = {
      method: 'GET',
      authenticate: false,
      json: true,
      url: `/api/plants/does-not-exist`
    };
    helper.makeRequest(reqOptions, (error, httpMsg, response) => {
      debug(response);

      // TODO: If the userId exists and has no plants then this test should run like this.
      //       If the userId does not exist then we should get back a 404 - which is this test
      assert(!error);
      assert.equal(httpMsg.statusCode, 200);
      assert(!response);
      // assert.equal(response.error, 'missing');

      done();
    });
  });

});
