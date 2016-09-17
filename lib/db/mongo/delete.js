const _ = require('lodash');

const logger = require('../../logging/logger').create('mongo-delete');

module.exports = (db, collection, query, callback) => {

  const coll = db.collection(collection);
  logger.trace('deleteMany:', collection, query);
  coll.deleteMany(query, (deleteErr, results) => {
    logger.trace('deleteMany results', {deleteErr, results: _.omit(results, ['connection', 'message'])});
    // results if query item was found:
    //
    // { result: { ok: 1, n: 3 }, deletedCount: 3
    //
    // result if query item was not found:
    //
    // { result: { ok: 1, n: 0 }, deletedCount: 0
    callback(deleteErr, results.deletedCount);
  });
};

