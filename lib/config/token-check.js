import _ from 'lodash';
import jwt from 'jwt-simple';
import secrets from '../config/secrets';
import deb from 'debug';

const debug = deb('plant:token-check');

export default (req, res, next) => {
  const token = _.get(req, 'headers.authorization');
  if(token) {
    debug('token: %o', token);
    const parts = token.split(' ');
    if(parts.length === 2) {
      if(parts[0] !== 'Bearer') {
        debug('First part of token is not Bearer:', parts[0]);
      }
      const user = jwt.decode(parts[1], secrets.tokenSecret);
      if(user) {
        debug('user: %o', user);
        req.user = user;
        req.isAuthenticated = true;
      }
    }
  } else {
    debug('no token in headers:', req.headers);
  }
  next();
};

export function requireToken(req, res, next) {
  if(!req.isAuthenticated) {
    debug('requireToken Object.keys(res):', Object.keys(res));
    return res.status(401).send({error: 'Not Authorized'});
  } else {
    next();
  }
}
