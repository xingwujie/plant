import * as api from './api-plant';
import * as auth from './auth';
import * as client from './client';

export function index(app, passport) {
  client.client(app);
  auth.auth(app, passport);
  api.api(app);
};
