import * as facebookAuth from './config/passport-facebook';
import * as routes from './routes';
import * as tokenCheck from './config/token-check';
import bodyParser from 'body-parser';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import d from 'debug';
import * as DesignDB from './db/design-db';
import express from 'express';
import favicon from 'serve-favicon';
import http from 'http';
import logger from 'morgan';
import methodOverride from 'method-override';
import passport from 'passport';
import path from 'path';

const debug = d('plant:server');

export default () => {
  require('nodeversioncheck');

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

  app.use(passport.initialize());
  // app.use(passport.session());

  facebookAuth.fbPassport(passport);

  // Setup authentication
  app.use(tokenCheck.tokenCheck);

  routes.index(app, passport);

  var tenMinutes = 10 * 60 * 1000; // 10 minutes * 60 seconds * 1000 milliseconds
  app.use(express.static(path.join(__dirname, '../build'), {maxAge: tenMinutes}));
  app.use(express.static(path.join(__dirname, '../public'), {maxAge: tenMinutes}));

// error handler (after routes)
  app.use((err, req, res, next) => {
    console.log('App Error:', err.stack);
    next();
  });

  app.use(function(req, res) {
    // At this point nothing has handled the request.
    // This is probably an invalid request.
    // We can let the React Router show the error page, however
    // we should also return a 404 status
    debug('Could not find: %s', req.url);
    return res.status(404).sendFile(path.join(__dirname, '../build', 'index.html'));
  });

  const designDB = new DesignDB.DesignDB();

  console.log('Updating design docs...');
  designDB.updateAllDesigns((err) => {
    if(err) {
      console.log('Error in updateAllDesigns:', err);
    } else {
      server.listen(3000, () => {
        console.log('Express server listening on port 3000');
      });
    }
  });

};
