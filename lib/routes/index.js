import userApi from './api-user';
import plantApi from './api-plant';
import plantsApi from './api-plants';
import noteApi from './api-note';
import * as auth from './auth';
import * as client from './client';

export function index(app, passport) {
  client.client(app);
  auth.auth(app, passport);
  plantApi(app);
  plantsApi(app);
  noteApi(app);
  userApi(app);
};
