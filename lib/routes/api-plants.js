import * as Plant from '../db/plant-db';

import d from 'debug';
const debug = d('plant:api-plants');

const plant = new Plant.Plant();

export default (app) => {

  // Anonymous request with userId in the params.
  app.get('/api/plants/:userId', (req, res) => {

    const {params = {}} = req || {};
    const {userId} = params;
    debug(`GET /api/plants/${userId}`);

    if(!userId) {
      return res.status(404).send({error: 'No userId in URL'});
    }

    plant.getByUserId(userId, (err, result) => {
      debug('GET /api/plants res.send:', err, result);
      if(err) {
        return res.status(500).send({error: err.message});
      } else {
        if(!result) {
          return res.status(404).send();
        }
        return res.status(200).send(result);
      }
    });
  });

};
