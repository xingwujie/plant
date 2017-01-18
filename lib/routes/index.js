const userApi = require('./api-user');
const plantApi = require('./api-plant');
const plantsApi = require('./api-plants');
const locationsApi = require('./api-locations');
const noteApi = require('./api-note');
const auth = require('./auth');
const client = require('./client');

function index(app, passport) {
  client(app);
  auth.auth(app, passport);
  locationsApi(app);
  noteApi(app);
  plantApi(app);
  plantsApi(app);
  userApi(app);
};

module.exports = {index};
