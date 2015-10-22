import jwt from 'jwt-simple';
import secrets from '../config/secrets';
import deb from 'debug';

const debug = deb('plant:routes/auth');

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

  // if user is authenticated in the session, carry on
  if (req.isAuthenticated){
    return next();
  }

  // if they aren't redirect them to the home page
  res.redirect('/');
}

export default (app, passport) => {

  // route for showing the profile page
  app.get('/profile', isLoggedIn, function(req, res) {
    res.render('profile.ejs', {
      user : req.user // get the user out of session and pass to template
    });
  });

  app.get('/auth/facebook', passport.authenticate('facebook'));

  // handle the callback after facebook has authenticated the user
  app.get('/auth/facebook/callback', (req, res, next) => {
    passport.authenticate('facebook', (err, user, info) => {
      debug('app.get(/auth/facebook/callback)', err, user, info);
      if (err) {
        return next(err);
      }

      if (!user) {
        return res.json(401, { error: 'Failed to authenticate user.' });
      }

      //user has authenticated correctly thus we create a JWT token
      var token = jwt.encode(user, secrets.tokenSecret);
      debug('jwt created and returned to client');
      res.json({ token : token });

    })(req, res, next);
  });

  // route for logging out
  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

};
