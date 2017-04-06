const logger = require('../logging/logger').create('routes-helper');

function helper (app) {

  app.use((req, res, next) => {
    const userAgent = (req && req.headers && req.headers['user-agent']) || '';
    if(userAgent.toLowerCase().includes('facebookexternalhit')) {
      const {headers, originalUrl, query} = req;
      logger.info('facebookexternalhit', {headers, originalUrl, query});
    }
    next();
  });

};

module.exports = helper;
