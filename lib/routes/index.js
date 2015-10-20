import client from './client';
import auth from './auth';

export default (app, passport) => {
  client(app);
  auth(app, passport);
};
