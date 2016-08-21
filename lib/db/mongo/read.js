
import d from 'debug';
const debug = d('plant:mongo-read');

module.exports = (db, collection, query, fields, options, callback) => {
  const coll = db.collection(collection);
  coll.find(query, fields, options).toArray((err, result) => {
    debug('read:', collection, query);
    debug('result:', result);
    if(err) {
      return callback(err);
    }
    if(result && result.length === 0) {
      return callback(null, null);
    }
    debug('result.0._id type:', typeof result[0]._id);
    return callback(null, result);
  });

};
