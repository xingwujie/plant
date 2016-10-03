const mongo = require('../db/mongo');

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

};
