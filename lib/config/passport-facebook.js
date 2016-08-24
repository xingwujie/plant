import _ from 'lodash';
import mongoDb from '../db/mongo';
import * as passportFacebook from 'passport-facebook';
import d from 'debug';

const debug = d('plant:passport-facebook');
const FacebookStrategy = passportFacebook.Strategy;

export function fbPassport (passport) {

  passport.use(new FacebookStrategy({
    clientID: process.env.PLANT_FB_ID,
    clientSecret: process.env.PLANT_FB_SECRET,
    callbackURL: '/auth/facebook/callback',
    profileFields: ['id', 'emails', 'gender', 'link', 'locale', 'name', 'timezone', 'updated_time', 'verified']
  },

  // facebook will send back the token and profile
  (token, refreshToken, profile, done) => {
    debug('profile:', profile);
    // Setup for new user in case user is not in DB
    const createdDate = new Date();
    const email = _.get(profile, '_json.emails.0', '') || _.get(profile, '_json.email', '');
    var newUser = {
      facebook: profile._json,
      name: `${profile.name.givenName} ${profile.name.familyName}`,
      createdAt: createdDate,
      updatedAt: createdDate
    };

    if(email) {
      newUser.email = email.toLowerCase();
    }

    // find the user in the database based on their facebook id
    mongoDb.findOrCreateUser(newUser, (err, user) => {

      if (err) {
        return done(err);
      }

      // if the user is found, then log them in
      if (user) {
        return done(null, user); // user found, return that user
      } else {
        return done(new Error('Could not find or create user.'));
      }

    });

  }));
};
