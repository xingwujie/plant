import d from 'debug';
const debug = d('plant:mongo-update');

module.exports = (db, collection, query, $set, callback) => {
  debug('update:', query, $set);
  const coll = db.collection(collection);
  coll.updateOne(query, {$set}, callback);
};
