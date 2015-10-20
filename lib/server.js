import bodyParser from 'body-parser';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import express from 'express';
import facebookAuth from './config/passport-facebook';
import favicon from 'serve-favicon';
import http from 'http';
import logger from 'morgan';
import methodOverride from 'method-override';
import passport from 'passport';
import path from 'path';
import routes from './routes';
import secrets from './config/secrets';
import session from 'express-session';

export default () => {
  const app = express();
  const server = http.createServer(app);

  app.disable('x-powered-by');
  app.use(compression());
  app.use(favicon(path.join(__dirname, '../app/img/favicon.ico')));
  app.use(logger('dev'));
  app.use(cookieParser());
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(bodyParser.json());
  app.use(methodOverride());

  app.use(session({
    resave: true,
    saveUninitialized: true,
    key: 'plant',
    secret: secrets.sessionSecret
    // cookie: {
    //   maxAge: 365 * 24 * 60 * 60 * 1000 // ms
    // },
  }));

  app.use(passport.initialize());
  app.use(passport.session());

  facebookAuth(passport);

  routes(app, passport);

  var tenMinutes = 10 * 60 * 1000; // 10 minutes * 60 seconds * 1000 milliseconds
  app.use(express.static(path.join(__dirname, '../build'), {maxAge: tenMinutes}));

// error handler (after routes)
  app.use(function (err, req, res, next) {
    console.log('App Error:', err);
    next();
  });

  app.use(function(req, res) {
    // At this point nothing has handled the request.
    // This is probably an invalid request.
    // We can let the React Router show the error page, however
    // we should also return a 404 status
    return res.status(404).sendFile(path.join(__dirname, '../build', 'index.html'));
  });


  server.listen(3000, function () {
    console.log('Express server listening on port 3000');
  });
};
