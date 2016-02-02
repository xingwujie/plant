import * as DesignDB from '../lib/db/design-db';
import assert from 'assert';
import fakePassport from './fake-passport';
import proxyquire from 'proxyquire';

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

let serverAndUser;
export function startServerAuthenticated(done) {
  if(serverAndUser) {
    return done(null, serverAndUser);
  }

  server.default((err, app) => {
    assert(!err);

    serverAndUser = {
      server: app,
      user: {} // TODO: Auth and set this
    };

    return done(err, serverAndUser);
  });
};
