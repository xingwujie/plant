import _ from 'lodash';
import jwt from 'jwt-simple';

const logger = require('../logging/logger').create('token-check');
const tokenSecret = process.env.PLANT_TOKEN_SECRET;

export function tokenCheck (req, res, next) {
  const token = _.get(req, 'headers.authorization');
  req.isAuthenticated = false;

  if(token) {
    const parts = token.split(' ');
    if(parts.length === 2) {
      if(parts[0] !== 'Bearer') {
        logger.error('Problem: First part of token is not Bearer', {tokenFirstPart: parts[0]});
      }
      let user;
      try {
        user = jwt.decode(parts[1], tokenSecret);
      } catch (jwtDecodeError) {
        logger.error('Caught error from jwt.decode', {jwtDecodeError}, {token});
      }
      if(user) {
        req.user = user;
        req.isAuthenticated = true;
      }
    } else {
      logger.error('Token unexpectedly does not have one space', {token});
    }
  }

  next();
};

export function requireToken(req, res, next) {
  if(!req.isAuthenticated) {
    // debug('auth failed in requireToken');
    return res.status(401).send({error: 'Not Authenticated'});
  } else {
    next();
  }
}
