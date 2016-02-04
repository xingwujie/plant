import plantApi from './api-plant';
import noteApi from './api-note';
import * as auth from './auth';
import * as client from './client';

export function index(app, passport) {
  client.client(app);
  auth.auth(app, passport);
  plantApi(app);
  noteApi(app);
};
