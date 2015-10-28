import api from './api';
import auth from './auth';
import client from './client';

export default (app, passport) => {
  client(app);
  auth(app, passport);
  api(app);
};
