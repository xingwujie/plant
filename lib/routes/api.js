import * as Plant from '../db/plant-db';
import * as tokenCheck from '../config/token-check';
import d from 'debug';

const {requireToken} = tokenCheck;

const debug = d('plant:api');
const plant = new Plant.Plant();

export function api(app) {

  app.post('/api/plant', requireToken, (req, res) => {

    debug('/api/plant req.user:', req.user);

    const userId = req.user._id;

    plant.create(userId, req.body, (err, result) => {
      return res.send(err ? {error: err.message} : result);
    });
  });

  app.get('/api/plants', requireToken, (req, res) => {

    debug('/api/plants', req.user);

    const userId = req.user._id;

    plant.getByUserId(userId, (err, result) => {
      return res.send(err ? {error: err.message} : result);
    });
  });

  app.post('/api/plant-note', requireToken, (req, res) => {

    const userId = req.user._id;

    plant.addNote(userId, req.body, (err, result) => {
      return res.send(err ? {error: err.message} : result);
    });
  });

};
