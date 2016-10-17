const mongo = require('../db/mongo');
const logger = require('../logging/logger').create('api-plants');

module.exports = (app) => {

  // Anonymous request with userId in the params.
  app.get('/api/plants/:userId', (req, res) => {

    const {params = {}} = req || {};
    const {userId} = params;

    if(!userId) {
      return res.status(404).send({error: 'No userId in URL'});
    }

    mongo.getPlantsByUserId(userId, (err, result) => {
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

  // Anonymous request with array of plantIds
  app.post('/api/unloaded-plants', (req, res) => {
    // logger.trace('/api/unloaded-plants body', {body: req.body});

    const {plantIds} = req.body;
    if(!plantIds || !plantIds.length) {
      logger.error('No ids in POST /api/unloaded-plants', {plantIds});
      return res.status(404).send('No plantIds in body request');
    }
    mongo.getPlantsByIds(plantIds, (getPlantsByIdsErr, plants) => {
      if(getPlantsByIdsErr) {
        return res.status(500).send('Error getting plants');
      }
      logger.trace('responding with plants:', {plants});
      return res.send(plants);
    });
  });

};
