import _ from 'lodash';
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

  // Probably doesn't need requireToken if it's an anonymous request with userId in the params.
  app.get('/api/plants/:userId', requireToken, (req, res) => {

    debug('GET /api/plants, req.user', req.user.name);

    // Use the userId on the URL if it's there otherwise the logged in
    // user.
    const userId = _.get(req, 'params.userId', req.user._id);
    // debug('GET /api/plants, userId', userId);

    plant.getByUserId(userId, (err, result) => {
      debug('GET /api/plants res.send:', err, result);
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
