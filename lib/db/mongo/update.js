import Helper from './helper';
import d from 'debug';
const debug = d('plant:mongo-update');

module.exports = (db, collection, query, doc, callback) => {
  debug('update:', query, doc);
  const coll = db.collection(collection);
  coll.updateOne(query, Helper.removeEmpty(doc), (err, result) => {
    if(err) {
      debug('err:', err);
      return callback(err);
    }
    return callback(null, result.result);
  });
};
