import db from '../db';
import passportFacebook from 'passport-facebook';
import secrets from '../config/secrets';

const FacebookStrategy = passportFacebook.Strategy;

export default (passport) => {

    // used to serialize the user for the session
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

    // deserialize the user
  passport.deserializeUser((id, done) => {
    db.getUserById(id, (err, user) => {
      done(err, user);
    });
  });

  passport.use(new FacebookStrategy({
    clientID: secrets.facebookAuth.clientID,
    clientSecret: secrets.facebookAuth.clientSecret,
    callbackURL: secrets.facebookAuth.callbackURL
  },

  // facebook will send back the token and profile
  (token, refreshToken, profile, done) => {

    // find the user in the database based on their facebook id
    db.getUserByEmail(profile.email, (err, user) => {

      if (err) {
        return done(err);
      }

      // if the user is found, then log them in
      if (user) {
        return done(null, user); // user found, return that user
      } else {
        // if there is no user found with that facebook id, create them
        var newUser = {
          facebook: {
            // set all of the facebook information in our user model
            id: profile.id, // set the users facebook id
            token: token // we will save the token that facebook provides to the user
          },
          name: `${profile.name.givenName} ${profile.name.familyName}`,
          email: profile.emails[0].value // facebook can return multiple emails so we'll take the first
        };

        db.createUser(newUser, (err, user) => {
          done(err, user);
        });

      }

    });

  }));
};
