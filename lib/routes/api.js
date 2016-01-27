import _ from 'lodash';
import * as BaseDB from '../db/base-db';
import * as Plant from '../db/plant-db';
import * as tokenCheck from '../config/token-check';
import d from 'debug';
import validators from '../../app/models';

const {
  plant: validatePlant,
  note: validateNote
} = validators;

const {requireToken} = tokenCheck;

const debug = d('plant:api');
const plant = new Plant.Plant();
const baseDb = new BaseDB.BaseDB();

export function api(app) {

  // Plant CRUD operations
  // Plant Create
  app.post('/api/plant', requireToken, (req, res) => {
    debug('POST /api/plant req.user:', req.user && req.user.name);

    req.body.userId = req.user._id;
    const isNew = true;

    validatePlant(req.body, {isNew}, (err, transformed) => {
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

  // Plant CRUD operations
  // Note Create
  app.post('/api/note', requireToken, (req, res) => {
    debug('POST /api/note req.user:', req.user && req.user.name);

    req.body.userId = req.user._id;
    const isNew = true;

    validateNote(req.body, {isNew}, (err, transformed) => {
      if(err) {
        debug(`response POST /api/note: 400`, err);
        return res.status(400).send(err);
      }

      baseDb.create(transformed, (err2, result) => {
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

    validatePlant(req.body, {isNew}, (err, transformed) => {
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

  // Anonymous request with userId in the params.
  app.get('/api/plants/:userId', (req, res) => {

    debug('GET /api/plants');
    const {params = {}} = req;
    const {userId} = params;
    debug('GET /api/plants, userId', userId);

    if(!userId) {
      return res.status(404).send({error: 'No userId in URL'});
    }

    plant.getByUserId(userId, (err, result) => {
      debug('GET /api/plants res.send:', err, result);
      return res.send(err ? {error: err.message} : result);
    });
  });

};
