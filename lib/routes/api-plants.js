import * as Plant from '../db/plant-db';

import d from 'debug';
const debug = d('plant:api');

const plant = new Plant.Plant();

export default (app) => {

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
