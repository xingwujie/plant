
const logger = require('../../logging/logger').create('mongo-read');

module.exports = (db, collection, query, fields, options, callback) => {
  const coll = db.collection(collection);
  coll.find(query, fields, options).toArray((findError, result) => {
    logger.trace('read result:', { collection, query, result });
    if (findError) {
      logger.error('read error:', { findError });
      return callback(findError);
    }
    if (result && result.length === 0) {
      return callback(null, null);
    }
    return callback(null, result);
  });
};
