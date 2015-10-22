// These are routes that the client will handle

import path from 'path';

// For these types of routes just send back the index.html file
// and it will do the rest of the routing.
function staticIndex(req, res) {
  res.sendFile(path.join(__dirname, '../../build', 'index.html'));
}

export default (app) => {

  const clientRoutes = [
    '/',
    '/login',
    '/help'
  ];

  clientRoutes.forEach((route) => {
    app.get(route, staticIndex);
  });

};
