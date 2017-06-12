const mongo = require('../db/mongo');

const logger = require('../logging/logger').create('api-locations');

module.exports = (app) => {
  app.get('/api/location/:locationId', (req, res) => {
    const { locationId } = req.params || {};
    if (!locationId) {
      logger.error('No locationId in /api/location GET', { 'req.params': req.params });
      return res.status(404).send({ success: false, message: 'Incorrect request, no location id' });
    }

    mongo.getLocationById(locationId, (getLocationError, location) => {
      if (getLocationError) {
        return res.status(500).send({ success: false, message: 'server error' });
      }
      return res.status(200).send(location);
    });
  });

  app.get('/api/locations', (req, res) => {
    mongo.getAllLocations((getLocationError, locations) => {
      if (getLocationError) {
        return res.status(500).send({ success: false, message: 'server error' });
      }
      return res.status(200).send(locations);
    });
  });
};
