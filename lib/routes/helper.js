const logger = require('../logging/logger').create('routes-helper');

function helper (app) {

  app.use((req, res, next) => {
    logger.trace('hit here in helper');
    if(req && req.headers && req.headers['user-agent']) {
      if(req.headers['user-agent'].toLowerCase().includes('facebookexternalhit')) {
        const {headers, originalUrl, query} = req;
        logger.info('facebookexternalhit', {headers, originalUrl, query});
      }
    }
    next();
  });

};

module.exports = helper;
