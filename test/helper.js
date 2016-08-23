import _ from 'lodash';
import assert from 'assert';
import async from 'async';
import constants from '../app/libs/constants';
import FakePassport from './fake-passport';
import mongo from '../lib/db/mongo';
import proxyquire from 'proxyquire';
import request from 'request';
import {makeMongoId} from '../app/libs/utils';

import d from 'debug';
const debug = d('plant:test.helper');

export function getUrl(url) {
  if(_.startsWith(url, 'http')) {
    return url;
  }

  return `http://127.0.0.1:3001${url}`;
}

let jwt;
export function makeRequest(opts, cb) {

  const auth = opts.authenticate
    ? {Authorization: 'Bearer ' + jwt }
    : {};

  const headers = {
    ...(opts.headers || {}),
    ...auth
  };

  const followRedirect = opts.followRedirect || false;

  const options = {
    ...opts,
    url: getUrl(opts.url),
    headers,
    followRedirect
  };

  // debug('options:', options);

  // cb will get (error, httpMsg, response);
  request(options, cb);
}

export function createUser(cb) {
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

  assert(!fbUser._id);
  mongo.findOrCreateFacebookUser(fbUser, (err, body) => {
    // debug('body:', body);

    assert(!err);
    assert(body);
    assert(body._id);
    assert(constants.mongoIdRE.test(body._id));
    debug('body:', body);
    debug('fbUser:', fbUser);
    assert.deepEqual(_.omit(body, ['_id']), fbUser);

    assert(body._id);

    cb(err, body);
  });
}

const data = {};
export function startServerAuthenticated(done) {
  if(data.app) {
    return done(null, data);
  }

  createUser((createUserError, user) => {
    assert(!createUserError);
    assert(user);
    const passport = new FakePassport(user);
    const server = proxyquire('../lib/server', { passport });

    server.default((err, application) => {
      assert(!err);

      data.app = application;

      makeRequest({
        url: '/auth/facebook/callback'
      }, (error, httpMsg) => {
        assert(!error);
        assert(httpMsg.headers);
        assert(httpMsg.headers.location);
        const parts = httpMsg.headers.location.split('=');
        jwt = parts[1];
        // debug('Test jwt:', jwt);
        assert(jwt);
        data.userId = passport.getUserId();
        return done(error, data);
      });
    });
  });
};

export function deleteAllPlantsForUser(cb) {
  mongo.deleteAllPlantsByUserId(data.userId, cb);
}

export function createPlants(numPlants, userId, cb) {
  debug('createPlant typeof userId:', typeof userId);
  const plantTemplate = {
    title: 'Plant Title',
    userId
  };

  var createPlant = function(count, callback) {
    const reqOptions = {
      method: 'POST',
      authenticate: true,
      body: {...plantTemplate, title: `${plantTemplate.title} ${count}`},
      json: true,
      url: '/api/plant'
    };

    makeRequest(reqOptions, (error, httpMsg, plant) => {
      assert(!error);
      assert.equal(httpMsg.statusCode, 200);

      assert(plant.title);

      callback(null, plant);
    });
  };

  // generate some plants
  async.times(numPlants, (n, next) => {
    createPlant(n, next);
  }, function(err, plants) {
    assert(!err);
    // we should now have 'numPlants' plants
    // debug('async.times:', plants);
    assert.equal(plants.length, numPlants);

    cb(err, plants);
  });

}

export function createNote(plantIds, noteOverride = {}, cb) {
  assert(_.isArray(plantIds));
  const noteTemplate = {
    note: 'This is a note',
    date: new Date(),
    plantIds,
    ...noteOverride
  };

  const reqOptions = {
    method: 'POST',
    authenticate: true,
    body: noteTemplate,
    json: true,
    url: '/api/note'
  };

  makeRequest(reqOptions, (error, httpMsg, response) => {
    assert(!error);
    assert.equal(httpMsg.statusCode, 200);
    assert(response._id);

    cb(null, response);
  });


}
