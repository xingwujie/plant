import _ from 'lodash';
import * as Plant from '../db/plant-db';
import * as tokenCheck from '../config/token-check';
import d from 'debug';
import {validate} from '../../app/models/plant';

const {requireToken} = tokenCheck;

const debug = d('plant:api');
const plant = new Plant.Plant();

export function api(app) {

  // Plant CRUD operations
  // Plant Create
  app.post('/api/plant', requireToken, (req, res) => {
    debug('POST /api/plant req.user:', req.user && req.user.name);

    req.body.userId = req.user._id;
    const isNew = true;
    const isClient = false;
    validate(req.body, {isNew, isClient}, (err, transformed) => {
      if(err) {
        debug(`response POST /api/plant: 400`, err);
        return res.status(400).send(err);
      }

      plant.create(transformed, (err2, result) => {
        if(err) {
          return res.status(err.statusCode).send(err2);
        }
        return res.status(200).send(result);
      });
    });
  });

  // Plant Read
  app.get('/api/plant/:plantId', (req, res) => {
    debug(req.path);

    const plantId = req.params.plantId;
    if(!plantId) {
      debug(`response GET /api/plant/${plantId}: 404`);
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

    req.body.userId = req.user._id;
    const isNew = false;
    const isClient = false;
    validate(req.body, {isNew, isClient}, (err, transformed) => {
      if(err) {
        debug(`response PUT /api/plant: 400`, err);
        return res.status(400).send(err);
      }

      plant.updateByUser(transformed, (err2, result) => {
        if(err2) {
          return res.status(err2.statusCode).send(err2);
        }
        return res.status(200).send(result);
      });
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
