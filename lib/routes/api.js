// API Routes

import {Plant} from '../db';

const plant = new Plant();

export default (app) => {

  // TODO: Add authentication
  // TODO: Remove the /create part of the route
  app.post('/api/plant', (req, res) => {
    const userId = 1; // TODO: Replace with req.user.id etc.
    plant.create(userId, req.body, (err, result) => {
      return res.send(err ? {error: err.message} : result);
    });
  });

  // TODO: Add authentication
  app.post('/api/plant-note', (req, res) => {

    const userId = 1; // TODO: Replace with req.user.id etc.

    plant.addNote(userId, req.body, (err, result) => {
      return res.send(err ? {error: err.message} : result);
    });
  });

};
