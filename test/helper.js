import _ from 'lodash';
import * as DesignDB from '../lib/db/design-db';
import assert from 'assert';
import fakePassport from './fake-passport';
import proxyquire from 'proxyquire';
import request from 'request';

const server = proxyquire('../lib/server', { passport: fakePassport });

import d from 'debug';
const debug = d('plant:test.helper');

// Many of the tests won't be able to run if the design docs haven't been
// inserted into the DB. Call the createDesigns() function at the beginning
// of all tests. The designsCreated flag will stop the designs from being
// created more than once.
var designsCreated = false;
export function createDesigns(done) {

  if(designsCreated) {
    return done();
  }

  debug('Creating designs from helper');
  const designDB = new DesignDB.DesignDB();

  designDB.updateAllDesigns((err) => {
    assert(!err);
    designsCreated = true;
    done();
  });

};

export function getUrl(url) {
  return `http://127.0.0.1:3000${url}`;
}

let jwt;
export function makeRequest(options, cb) {

  if(!_.startsWith(options.url, 'http')) {
    options.url = getUrl(options.url);
  }

  if(options.authenticate) {
    delete options.authenticate;
    options.headers = options.headers || {};
    options.headers = {
      ...options.headers,
      Authorization: 'Bearer ' + jwt
    };
  }

  options.followRedirect = options.followRedirect || false;

  // cb will get (error, httpMsg, response);
  request(options, cb);
}

let app;
export function startServerAuthenticated(done) {
  if(app) {
    return done(null, app);
  }

  server.default((err, application) => {
    assert(!err);

    app = application;

    makeRequest({
      url: '/auth/facebook/callback'
    }, (error, httpMsg) => {
      assert(!error);
      assert(httpMsg.headers);
      assert(httpMsg.headers.location);
      const parts = httpMsg.headers.location.split('=');
      jwt = parts[1];
      debug('Test jwt:', jwt);
      assert(jwt);
      return done(error);
    });
  });
};
