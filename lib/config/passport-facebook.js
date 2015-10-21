import {User} from '../db';
import passportFacebook from 'passport-facebook';
import secrets from '../config/secrets';

const FacebookStrategy = passportFacebook.Strategy;

const userDB = new User();

export default (passport) => {

    // used to serialize the user for the session
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

    // deserialize the user
  passport.deserializeUser((id, done) => {
    userDB.getUserById(id, (err, user) => {
      done(err, user);
    });
  });

  passport.use(new FacebookStrategy({
    clientID: secrets.facebookAuth.clientID,
    clientSecret: secrets.facebookAuth.clientSecret,
    callbackURL: secrets.facebookAuth.callbackURL,
    profileFields: ['id', 'email', 'gender', 'link', 'locale', 'name', 'timezone', 'updated_time', 'verified']
  },

  // facebook will send back the token and profile
  (token, refreshToken, profile, done) => {

    console.log('Facebook Strategy callback.');

    console.log('profile:', profile);
    console.log('refreshToken:', refreshToken);
    console.log('token:', token);

    // find the user in the database based on their facebook id
    userDB.getUserByEmail(profile.email, (err, user) => {

      if (err) {
        return done(err);
      }

      // if the user is found, then log them in
      if (user) {
        return done(null, user); // user found, return that user
      } else {
        // if there is no user found with that facebook id, create them
        const createdDate = new Date();
        var newUser = {
          facebook: profile._json,
          name: `${profile.name.givenName} ${profile.name.familyName}`,
          email: (profile._json.email || '').toLowerCase(), // facebook can return multiple emails so we'll take the first
          createdAt: createdDate,
          updatedAt: createdDate
        };

        userDB.createUser(newUser, (err, user) => {
          done(err, user);
        });

      }

    });

  }));
};
