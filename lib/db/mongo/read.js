import helper from './helper';

// import d from 'debug';
// const debug = d('plant:mongo-read');

module.exports = (db, collection, query, fields, options, callback) => {
  query = helper.fixStringId(query);
  const coll = db.collection(collection);
  coll.find(query, fields, options).toArray((err, result) => {
    // debug('read:', collection, query);
    // debug('result:', result);
    if(err) {
      return callback(err);
    }
    if(result && result.length === 0) {
      return callback(null, null);
    }
    return callback(null, result);
  });

};
