import _ from 'lodash';
import * as DesignDB from '../lib/db/design-db';
import * as Plant from '../lib/db/plant-db';
import assert from 'assert';
import async from 'async';
import fakePassport from './fake-passport';
import proxyquire from 'proxyquire';
import request from 'request';

const server = proxyquire('../lib/server', { passport: fakePassport });

// import d from 'debug';
// const debug = d('plant:test.helper');

const plantDB = new Plant.Plant();

// Many of the tests won't be able to run if the design docs haven't been
// inserted into the DB. Call the createDesigns() function at the beginning
// of all tests. The designsCreated flag will stop the designs from being
// created more than once.
var designsCreated = false;
export function createDesigns(done) {

  if(designsCreated) {
    return done();
  }

  // debug('Creating designs from helper');
  const designDB = new DesignDB.DesignDB();

  designDB.updateAllDesigns((err) => {
    assert(!err);
    designsCreated = true;
    done();
  });

};

export function getUrl(url) {
  if(_.startsWith(url, 'http')) {
    return url;
  }

  return `http://127.0.0.1:3000${url}`;
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

const data = {};
export function startServerAuthenticated(done) {
  if(data.app) {
    return done(null, data);
  }

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
      data.userId = fakePassport.getUserId();
      return done(error, data);
    });
  });
};

export function deleteAllPlantsForUser(cb) {
  plantDB.deleteByUserId(data.userId, cb);
}

export function createPlants(numPlants, userId, cb) {
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

    makeRequest(reqOptions, (error, httpMsg, response) => {
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
    assert(response.ok);

    cb(null, {
      ...reqOptions.body,
      _id: response.id
    });
  });


}
