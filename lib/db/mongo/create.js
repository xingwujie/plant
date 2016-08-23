import Helper from './helper';
import d from 'debug';
const debug = d('plant:mongo-create');

export default class Create {

  static create(db, collection, doc, callback) {
    // debug('create many:', collection, doc);
    const coll = db.collection(collection);
    coll.insert(Helper.removeEmpty(doc), (err, body) => {
      if(err) {
        return callback(err);
      }
      return callback(null, body.ops);
    });
  }

  static createOne(db, collection, doc, callback) {
    debug('createOne:', doc);
    Create.create(db, collection, doc, (err, body) => {
      if(err) {
        return callback(err);
      }
      return callback(null, body[0]);
    });
  }
}
