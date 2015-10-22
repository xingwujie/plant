import _ from 'lodash';
import jwt from 'jwt-simple';
import secrets from '../config/secrets';
import deb from 'debug';

const debug = deb('plant:token-check');

export default (res, req, next) => {
  debug('token-check');
  const token = _.get(req, 'headers.token');
  if(token) {
    debug('token: %o', token);
    const user = jwt.decode(token, secrets.tokenSecret);
    if(user) {
      debug('user: %o', user);
      req.user = user;
      req.isAuthenticated = true;
    }
  } else {
    debug('no token in headers');
  }
  next();
};
