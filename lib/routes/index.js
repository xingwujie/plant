const auth = require('./auth');
const client = require('./client');
const locationsApi = require('./api-locations');
const noteApi = require('./api-note');
const plantApi = require('./api-plant');
const plantsApi = require('./api-plants');
const userApi = require('./api-user');

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
