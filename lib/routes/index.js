const userApi = require('./api-user');
const plantApi = require('./api-plant');
const plantsApi = require('./api-plants');
const noteApi = require('./api-note');
const auth = require('./auth');
const client = require('./client');

function index(app, passport) {
  client.client(app);
  auth.auth(app, passport);
  plantApi(app);
  plantsApi(app);
  noteApi(app);
  userApi(app);
};

module.exports = {index};
