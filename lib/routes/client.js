// These are routes that the client will handle

const indexHtml = require('../render');
const plant = require('../render/plant');

// For these types of routes just send back the basic html
// and it will do the rest of the routing on the client.
function staticIndex(req, res) {
  res.send(indexHtml());
}

function client(app) {

  const clientRoutes = [
    '/',
    '/plants/:slug/:id',
    '/auth/token',
    '/help',
    '/layout/:slug/:id',
    '/login',
    '/privacy',
    '/profile',
    '/terms',
  ];

  clientRoutes.forEach((route) => {
    app.get(route, staticIndex);
  });

};

function server(app) {
  app.get('/plant/:slug/:id', plant);
}

module.exports = (app) => {
  client(app);
  server(app);
};
