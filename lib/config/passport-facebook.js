import {User} from '../db';
import passportFacebook from 'passport-facebook';
import secrets from '../config/secrets';

const FacebookStrategy = passportFacebook.Strategy;

const userDB = new User();

export default (passport) => {

  passport.use(new FacebookStrategy({
    clientID: secrets.facebookAuth.clientID,
    clientSecret: secrets.facebookAuth.clientSecret,
    callbackURL: secrets.facebookAuth.callbackURL,
    profileFields: ['id', 'email', 'gender', 'link', 'locale', 'name', 'timezone', 'updated_time', 'verified']
  },

  // facebook will send back the token and profile
  (token, refreshToken, profile, done) => {

    // Setup for new user in case user is not in DB
    const createdDate = new Date();
    var newUser = {
      facebook: profile._json,
      name: `${profile.name.givenName} ${profile.name.familyName}`,
      email: (profile._json.email || '').toLowerCase(), // facebook can return multiple emails so we'll take the first
      createdAt: createdDate,
      updatedAt: createdDate
    };

    // find the user in the database based on their facebook id
    userDB.findOrCreateUser(newUser, (err, user) => {

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
