import * as facebookAuth from './config/passport-facebook';
import * as googleAuth from './config/passport-google';
import * as routes from './routes';
import * as tokenCheck from './config/token-check';
import bodyParser from 'body-parser';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import express from 'express';
import http from 'http';
import Logger from './logging/logger';
import morgan from 'morgan';
import methodOverride from 'method-override';
import mongo from './db/mongo';
import passport from 'passport';
import path from 'path';
import indexHtml from './render';

const logLevel = process.env.PLANT_LOG_LEVEL ||
  process.env.NODE_ENV === 'production' ? 'info' : 'trace';
Logger.setLevel(logLevel);

const logger = new Logger('server');

export default (cb) => {
  require('node-version-checker');

  const app = express();
  const server = http.createServer(app);

  // So that Passport uses the appropriate scheme when behind a reverse proxy
  app.enable('trust proxy');
  app.disable('x-powered-by');
  app.use(compression());
  app.use(morgan('dev'));
  app.use(cookieParser());
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(bodyParser.json());
  app.use(methodOverride());

  app.use(passport.initialize());

  facebookAuth.fbPassport(passport);
  googleAuth.googlePassport(passport);

  // Setup authentication
  app.use(tokenCheck.tokenCheck);

  routes.index(app, passport);

  var tenMinutes = 10 * 60 * 1000; // 10 minutes * 60 seconds * 1000 milliseconds
  app.use(express.static(path.join(__dirname, '../build'), {maxAge: tenMinutes}));
  app.use(express.static(path.join(__dirname, '../public'), {maxAge: tenMinutes}));

// error handler (after routes)
  app.use((err, req, res, next) => {
    logger.error('App Error:', err.stack);
    next();
  });

  app.use(function(req, res) {
    // At this point nothing has handled the request.
    // This is probably an invalid request.
    // We can let the React Router show the error page, however
    // we should also return a 404 status
    logger.error('Could not find route', {url: req.url});
    return res.status(404).send(indexHtml());
  });

  mongo.GetDb((dbErr) => {
    if(dbErr) {
      logger.fatal('Error connecting to DB', {
        dbErr,
        dbConnection: mongo.getDbConnection()
      });
    } else {
      server.listen(3001, (error) => {
        if(error) {
          logger.fatal('Error in server.listen', {error});
        } else {
          logger.info('Express server listening on port 3001');
        }
        if(cb) {
          cb(error, server);
        }
      });
    }
  });

};
