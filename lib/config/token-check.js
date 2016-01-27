import _ from 'lodash';
import jwt from 'jwt-simple';
import deb from 'debug';

const debug = deb('plant:token-check');
const tokenSecret = process.env.PLANT_TOKEN_SECRET;

export function tokenCheck (req, res, next) {
  const token = _.get(req, 'headers.authorization');
  req.isAuthenticated = false;
  if(token) {
    // debug('token: %o', token);
    const parts = token.split(' ');
    if(parts.length === 2) {
      if(parts[0] !== 'Bearer') {
        debug('Problem: First part of token is not Bearer:', parts[0]);
      }
      let user;
      try {
        user = jwt.decode(parts[1], tokenSecret);
      } catch (e) {
        // TODO: Add logging
        console.log(e);
        console.log('headers.authorization:', token);
      }
      if(user) {
        // debug('user: %o', user);
        req.user = user;
        req.isAuthenticated = true;
      }
    }
  } else {
    debug('no token in headers');
  }
  next();
};

export function requireToken(req, res, next) {
  if(!req.isAuthenticated) {
    debug('auth failed in requireToken');
    return res.status(401).send({error: 'Not Authorized'});
  } else {
    next();
  }
}
