import _ from 'lodash';
import deb from 'debug';
import jwt from 'jwt-simple';
import secrets from '../config/secrets';

const debug = deb('plant:routes/auth');

export default (app, passport) => {

  app.get('/auth/facebook', passport.authenticate('facebook'));

  app.get('/auth/with', (req, res) => {
    let user = jwt.decode(req.query.code, secrets.tokenSecret);

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

  // handle the callback after facebook has authenticated the user
  app.get('/auth/facebook/callback', (req, res, next) => {
    passport.authenticate('facebook', (err, user, info) => {
      debug('app.get(/auth/facebook/callback)', err, user, info);
      if (err) {
        debug(`app.get(/auth/facebook/token) error: ${err}`);
        return next(err);
      }

      if (!user) {
        return res.json(401, { error: 'Failed to authenticate user.' });
      }

      //user has authenticated correctly thus we create a JWT token
      var token = jwt.encode(user, secrets.tokenSecret);
      debug('jwt created and returned to client');
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
