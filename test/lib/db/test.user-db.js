import _ from 'lodash';
import { createDesigns } from '../../helper';
import * as User from '../../../lib/db/user-db';
import assert from 'assert';
import constants from '../../../app/libs/constants';

// import d from 'debug';
// const debug = d('plant:test.user');

describe('/lib/db/user/', function() {
  this.timeout(10000);

  before((done) => {
    createDesigns(done);
  });

  const fbUser = {
    facebook: {
      id: '1234567890123456',
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
    updatedAt: '2016-01-28T14:59:32.989Z',
    type: 'user'
  };

  it('should create a user account if everything is present', (done) => {
    const userDB = new User.User();

    userDB.findOrCreateFacebookUser(fbUser, (err, body) => {

      assert(!err);
      assert(body);
      assert(body._id);
      assert(constants.uuidRE.test(body._id));
      assert.deepStrictEqual(_.omit(body, ['_id', '_rev']), fbUser);

      done();
    });
  });

  it('should fetch an exisiting user', (done) => {
    const userDB = new User.User();

    const user = {
      facebook: {
        id: fbUser.facebook.id
      },
    };

    userDB.findOrCreateFacebookUser(user, (err, body) => {
      // TODO: This test is WIP
      assert(!err);
      assert(body);
      assert(body._id);
      assert(constants.uuidRE.test(body._id));
      assert.deepStrictEqual(_.omit(body, ['_id', '_rev']), fbUser);

      done();
    });
  });

  it('should fail to create a user account if there is no object', (done) => {
    const userDB = new User.User();

    userDB.findOrCreateFacebookUser(null, (err, body) => {

      assert(err);
      assert.equal(err.message, 'No facebook.id:');
      assert(!body);

      done();
    });
  });

});
