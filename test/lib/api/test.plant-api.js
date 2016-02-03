import _ from 'lodash';
import {makeCouchId} from '../../../app/libs/utils';
import * as helper from '../../helper';
import assert from 'assert';
import constants from '../../../app/libs/constants';

import d from 'debug';
const debug = d('plant:test.plant-api');

describe('plant-api', function() {
  this.timeout(10000);

  before('it should start the server and setup auth token', done => {
    helper.startServerAuthenticated((err) => {
      assert(!err);
      done();
    });
  });

  before('it should create a user', done => {
    done();
  });

  const initialPlant = {
    title: 'Plant Title',
    // _id: makeCouchId(),
    userId: makeCouchId(),
  };
  let plantId;

  it('should create a plant', (done) => {
    const reqOptions = {
      method: 'POST',
      authenticate: true,
      body: initialPlant,
      json: true,
      url: '/api/plant'
    };
    helper.makeRequest(reqOptions, (error, httpMsg, response) => {
      debug('response:', response);
      // response should look like:
      // { ok: true,
      // id: '500147d5b68746efa2cc18510d4663a6',
      // rev: '1-bbeb5b8c4a14d2ff9008a4c818443bf7' }
      assert(!error);
      assert(httpMsg.statusCode, 200);
      assert(response);
      assert(response.ok);
      assert(constants.uuidRE.test(response.id));
      assert(_.startsWith(response.rev, '1-'));

      plantId = response.id;

      done();
    });
  });

  it('should retrieve the just created plant', (done) => {
    const reqOptions = {
      method: 'GET',
      authenticate: false,
      json: true,
      url: `/api/plant/${plantId}`
    };
    helper.makeRequest(reqOptions, (error, httpMsg, response) => {
      debug('response:', response);
      // response should look like:
      // { _id: 'e5fc6fff0a8f48ad90636b3cea6e4f93',
      // _rev: '1-fecae45e9dfdde023b93ebe313ff6ce1',
      // title: 'Plant Title',
      // userId: '241ff27e28c7448fb22c4f6fb2580923',
      // type: 'plant' }
      assert(!error);
      assert(httpMsg.statusCode, 200);
      assert(response);
      // TODO: Will the client ever need the _rev?
      // If not we should strip out at source.
      assert.equal(response._id, plantId);
      assert.equal(response.title, initialPlant.title);
      assert.equal(response.type, 'plant');

      done();
    });
  });

});
