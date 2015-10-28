// API Routes

import {Plant} from '../db';

const plant = new Plant();

export default (app) => {

  // TODO: Add authentication
  app.post('/api/plant/create', (req, res) => {
    const userId = 1; // TODO: Replace with req.user.id etc.
    plant.create(userId, req.body, (err, result) => {
      return res.send(err ? {error: err.message} : result);
    });
  });

};
