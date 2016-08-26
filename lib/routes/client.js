// These are routes that the client will handle

import indexHtml from '../render';

// For these types of routes just send back the basic html
// and it will do the rest of the routing on the client.
function staticIndex(req, res) {
  res.send(indexHtml());
}

export function client(app) {

  const clientRoutes = [
    '/',
    '/plants/:slug/:id',
    '/auth/token',
    '/help',
    '/login',
    '/plant/:slug/:id',
    '/profile',
  ];

  clientRoutes.forEach((route) => {
    app.get(route, staticIndex);
  });

};
