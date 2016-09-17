const Helper = require('./helper');
const logger = require('../../logging/logger').create('mongo-update');

module.exports = class Update {

  static updateOne (db, collection, query, doc, callback) {
    logger.trace('update', {query, doc});
    const coll = db.collection(collection);
    coll.updateOne(query, Helper.removeEmpty(doc), (updateOneError, result) => {
      if(updateOneError) {
        logger.error('updateOne error', {updateOneError});
        return callback(updateOneError);
      }
      return callback(null, result.result);
    });
  }

};
