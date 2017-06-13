const mongo = require('../db/mongo');
const logger = require('../logging/logger').create('api-plants');

module.exports = (app) => {
  /**
   * An anonymous request for all plants at a given location.
   */
  app.get('/api/plants/:locationId', (req, res) => {
    const { params = {} } = req || {};
    const { locationId } = params;

    if (!locationId) {
      return res.status(404).send({ error: 'No locationId in URL' });
    }

    const loggedInUserId = req.user && req.user._id;
    return mongo.getPlantsByLocationId(locationId, loggedInUserId, (err, result) => {
      if (err) {
        return res.status(500).send({ error: err.message });
      }
      if (!result) {
        return res.status(404).send();
      }
      return res.status(200).send(result);
    });
  });

  // Anonymous request with array of plantIds
  app.post('/api/unloaded-plants', (req, res) => {
    // logger.trace('/api/unloaded-plants body', {body: req.body});

    const { plantIds } = req.body;
    if (!plantIds || !plantIds.length) {
      logger.error('No ids in POST /api/unloaded-plants', { plantIds });
      return res.status(404).send('No plantIds in body request');
    }
    const loggedInUserId = req.user && req.user._id;
    return mongo.getPlantsByIds(plantIds, loggedInUserId, (getPlantsByIdsErr, plants) => {
      if (getPlantsByIdsErr) {
        return res.status(500).send('Error getting plants');
      }
      logger.trace('responding with plants:', { plants });
      return res.send(plants);
    });
  });
};
