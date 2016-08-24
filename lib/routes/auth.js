import _ from 'lodash';
import d from 'debug';
import jwt from 'jwt-simple';
import mongoDb from '../db/mongo';

const debug = d('plant:routes/auth');
const tokenSecret = process.env.PLANT_TOKEN_SECRET;

export function auth (app, passport) {

  app.get('/auth/facebook', passport.authenticate('facebook'));

  app.get('/auth/with', (req, res) => {
    let user = jwt.decode(req.query.code, tokenSecret);

    if(!user) {
      return res.status(401).send({
        code: req.query.code,
        error: 'Failed to decode'
      });
    }

    user = _.pick(user, ['_id', 'name']);
    user.jwt = req.query.code;

    return res.status(200).send(user);
  });

  // Handle dev-mode login and create or find user Granny Smith
  app.get('/auth/dev', (req, res) => {
    if(process.env.NODE_ENV === 'production') {
      return res.status(403).send('Not allowed in production');
    }

    const createdDate = new Date();
    var newUser = {
      facebook: {
        id: '1234554321'
      },
      name: 'Granny Smith',
      email: 'granny.smith@apple-orchard.com',
      createdAt: createdDate,
      updatedAt: createdDate
    };

    // find the user in the database based on their facebook id
    mongoDb.findOrCreateUser(newUser, (err, user) => {
      if (err) {
        debug('create/find user error:', err);
        return res.status(500).send(err);
      }

      if (!user) {
        debug('app.get(/auth/dev) no user');
        return res.json(401, { error: 'Could not find or create user' });
      }

      //user has authenticated correctly thus we create a JWT token
      var token = jwt.encode(user, tokenSecret);
      return res.redirect('/auth/token?jwt=' + token);

    });
  });

  // handle the callback after facebook has authenticated the user
  app.get('/auth/facebook/callback', (req, res, next) => {
    passport.authenticate('facebook', (err, user /*, info*/) => {
      // debug('app.get(/auth/facebook/callback)', err, user, info);
      if (err) {
        debug(`app.get(/auth/facebook/token) error: ${err}`);
        return next(err);
      }

      if (!user) {
        return res.json(401, { error: 'Failed to authenticate user.' });
      }

      //user has authenticated correctly thus we create a JWT token
      var token = jwt.encode(user, tokenSecret);
      // debug('jwt created and returned to client');
      return res.redirect('/auth/token?jwt=' + token);

    })(req, res, next);
  });

  // route for logging out
  app.get('/logout', function(req, res) {
    // TODO: Should probably not be necessary for server to know about logout
    // as the client should be able to delete the token which would make it
    // impossible to do a subsequent authenticated call.
    req.logout();
    res.redirect('/');
  });

};
