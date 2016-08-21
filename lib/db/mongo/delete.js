import _ from 'lodash';

import d from 'debug';
const debug = d('plant:mongo-delete');

module.exports = (db, collection, query, callback) => {

  const coll = db.collection(collection);
  debug('deleteMany:', collection, query);
  coll.deleteMany(query, (deleteErr, results) => {
    debug('deleteMany deleteErr', deleteErr);
    debug('deleteMany results', _.omit(results, ['connection', 'message']));
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

