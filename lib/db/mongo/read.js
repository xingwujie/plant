
module.exports = (db, collection, query, fields, options, callback) => {

  const coll = db.collection(collection);
  coll.find(query, fields, options).toArray((err, result) => {
    if(err) {
      return callback(err);
    }
    if(result && result.length === 0) {
      return callback(null, null);
    }
    return callback(null, result);
  });

};
