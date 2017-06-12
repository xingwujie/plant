// These are routes that the client will handle

const indexHtml = require('../render');
const plant = require('../render/plant');
const article = require('../render/article');

// For these types of routes just send back the basic html
// and it will do the rest of the routing on the client.
function staticIndex(title, req, res) {
  res.send(indexHtml({ title }));
}

function client(app) {
  const clientRoutes = [
    { route: '/', title: 'Plaaant' },
    { route: '/plants/:slug/:id', title: 'Plaaant Plant List' },
    { route: '/auth/token', title: 'Plaaant Authenticate' },
    { route: '/help', title: 'Plaaant Help' },
    { route: '/layout/:slug/:id', title: 'Plaaant Layout' },
    { route: '/login', title: 'Plaaant Login' },
    { route: '/privacy', title: 'Plaaant Privacy Policy' },
    { route: '/profile', title: 'Plaaant User Profile' },
    { route: '/terms', title: 'Plaaant Terms and Conditions' },
  ];

  clientRoutes.forEach((route) => {
    app.get(route.route, staticIndex.bind(null, route.title));
  });
}

function server(app) {
  app.get('/plant/:slug/:id', plant);
  app.get('/article/:slug/:id', article);
}

module.exports = (app) => {
  client(app);
  server(app);
};
