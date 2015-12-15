import _ from 'lodash';
import * as Plant from '../db/plant-db';
import * as tokenCheck from '../config/token-check';
import d from 'debug';

const {requireToken} = tokenCheck;

const debug = d('plant:api');
const plant = new Plant.Plant();

export function api(app) {

  // Plant CRUD operations
  // Plant Create
  app.post('/api/plant', requireToken, (req, res) => {
    debug('POST /api/plant req.user:', req.user && req.user.name);

    const userId = req.user._id;

    plant.create(userId, req.body, (err, result) => {
      return res.send(err ? {error: err.message} : result);
    });
  });

  // Plant Read
  app.get('/api/plant/:plantId', (req, res) => {
    debug(req.path);

    const plantId = req.params.plantId;
    if(!plantId) {
      debug(`response /api/plant/${plantId}: 404`);
      return res.status(404).send({error: `Missing plantId in request url: ${req.path}`});
    }

    plant.getByPlantId(plantId, (err, result) => {
      debug(`response /api/plant/${plantId}:`, result);
      return res.send(err ? {error: err.message} : result);
    });
  });

  // Plant Update
  app.put('/api/plant', requireToken, (req, res) => {

    debug('PUT /api/plant req.user:', req.user && req.user.name);

    const userId = req.user._id;

    // TODO: Need isomorphic validation for PUT and POST and client side.
    if(userId !== req.body.userId && req.body.type !== 'plant') {
      debug(`PUT /api/plant 403 userId=${userId} req.body.userId=${req.body.userId}`);
      return res.status(403).send({error: 'User does not match'});
    }

    plant.updateByUser(req.body, userId, (err, result) => {
      if(err) {
        return res.status(err.statusCode).send(err);
      }
      return res.status(200).send(result);
    });
  });

  // Plant Delete
  app.delete('/api/plant/:plantId', requireToken, (req, res) => {

    const plantId = req.params.plantId;
    debug(`DELETE /api/plant/${plantId} req.user:`, req.user && req.user.name);

    if(!plantId) {
      return res.status(403).send({error: 'Missing plantId'});
    }

    const userId = req.user._id;

    plant.delete(plantId, userId, (err, result) => {
      return res.send(err ? {error: err.message} : result);
    });
  });

  // Probably doesn't need requireToken if it's an anonymous request with userId in the params.
  app.get('/api/plants/:userId', (req, res) => {

    debug('GET /api/plants, req.user', req.user && req.user.name);

    // Use the userId on the URL if it's there otherwise the logged in
    // user.
    const userId = _.get(req, 'params.userId', req.user._id);
    debug('GET /api/plants, userId', userId);

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
