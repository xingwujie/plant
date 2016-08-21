import mongo from '../db/mongo';
import * as tokenCheck from '../config/token-check';
import d from 'debug';
import validators from '../../app/models';

const {
  plant: validatePlant,
} = validators;

const {requireToken} = tokenCheck;

const debug = d('plant:api');

export default (app) => {

  // Plant CRUD operations
  // Plant Create
  app.post('/api/plant', requireToken, (req, res) => {
    // debug('POST /api/plant req.user:', req.user && req.user.name);

    req.body.userId = req.user._id;
    const isNew = true;

    validatePlant(req.body, {isNew}, (err, transformed) => {
      if(err) {
        // debug(`response POST /api/plant: 400`, err);
        // TODO: Log this. Shouldn't happen unless someone is hacking
        return res.status(400).send(err);
      }

      mongo.createPlant(transformed, (createPlantErr, result) => {
        if(createPlantErr) {
          return res.status(500).send(createPlantErr);
        }
        return res.status(200).send(result);
      });
    });
  });

  // Plant Read
  app.get('/api/plant/:plantId', (req, res) => {

    const plantId = req.params.plantId;
    if(!plantId) {
      return res.status(404).send({error: `Missing plantId in request url: ${req.path}`});
    }

    mongo.getPlantById(plantId, (err, result) => {
      debug(`response /api/plant/${plantId}:`, result);
      if(err) {
        return res.status(500).send({error: err.message});
      } else {
        if(result) {
          return res.status(200).send(result);
        } else {
          return res.status(404).send({error: 'missing'});
        }
      }
    });
  });

  // Plant Update
  app.put('/api/plant', requireToken, (req, res) => {
    // debug('PUT /api/plant req.user:', req.user && req.user.name);

    req.body.userId = req.user._id;
    const isNew = false;

    validatePlant(req.body, {isNew}, (err, transformed) => {
      if(err) {
        debug('response PUT /api/plant: 400', err);
        return res.status(400).send(err);
      }

      mongo.updatePlant(transformed, (updatePlantErr, result) => {
        if(updatePlantErr) {
          return res.status(500).send(updatePlantErr);
        }
        return res.status(200).send(result);
      });
    });
  });

  // Plant Delete
  app.delete('/api/plant/:plantId', requireToken, (req, res) => {
    const {plantId} = req.params;
    debug(`#1 app.delete(\'/api/plant/${plantId}\'`);

    if(!plantId) {
      return res.status(403).send({error: 'Missing plantId'});
    }

    const userId = req.user._id;

    mongo.deletePlant(plantId, userId, (plantDeleteErr, deletedCount) => {
      debug('#2 app.delete(\'/api/plant/:plantId\'', plantDeleteErr);
      debug('#3 deletedCount:', deletedCount);
      if(plantDeleteErr) {
        debug('500');
        return res.status(500).send({Error: plantDeleteErr.message});
      }
      if(deletedCount) {
        debug('200');
        return res.status(200).send({message: 'Deleted'});
      } else {
        debug('404');
        return res.status(404).send({message: 'Not Found'});
      }
    });
  });

};
