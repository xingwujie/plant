import _ from 'lodash';
import helper from './helper';

module.exports = (db, collection, doc, callback) => {
  const query = helper.fixStringId({
    _id: doc._id
  });

  const update = {
    $set: _.omit(doc, ['_id'])
  };
  const coll = db.collection(collection);
  coll.updateOne(query, update, callback);
};
