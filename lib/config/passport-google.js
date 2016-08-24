import _ from 'lodash';
import mongo from '../db/mongo';
import * as passportGoogle from 'passport-google-oauth20';
import d from 'debug';

const debug = d('plant:passport-google');
const GoogleStrategy = passportGoogle.Strategy;

export function googlePassport (passport) {

  passport.use(new GoogleStrategy({
    clientID: process.env.PLANT_GOOGLE_ID,
    clientSecret: process.env.PLANT_GOOGLE_SECRET,
    callbackURL: '/auth/google/callback',
    profileFields: ['id', 'emails', 'gender', 'link', 'locale', 'name', 'timezone', 'updated_time', 'verified']
  },

  // Google will send back the token and profile
  (token, refreshToken, profile, done) => {
    debug('profile:', profile);
    // Setup for new user in case user is not in DB
    const createdDate = new Date();
    const email = _.get(profile, 'emails.0', '');
    var newUser = {
      google: profile._json,
      name: profile.displayName,
      createdAt: createdDate,
      updatedAt: createdDate
    };

    if(email) {
      newUser.email = email.toLowerCase();
    }

    // find the user in the database based on their Google id
    mongo.findOrCreateUser(newUser, (err, user) => {

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
