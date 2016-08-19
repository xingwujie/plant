import _ from 'lodash';
import helper from './helper';

export default class Create {

  static create(db, collection, doc, callback) {
    doc = _.isArray(doc)
      ? doc.map(helper.fixStringId)
      : helper.fixStringId(doc);
    const coll = db.collection(collection);
    coll.insert(doc, (err, body) => {
      // body = {
      //   result: {
      //     ok: 1,
      //     n: 1
      //   },
      //   ops: [{
      //     facebook: {},
      //     name: 'John Smith',
      //     email: 'test@test.com',
      //     createdAt: '2016-01-28T14:59:32.989Z',
      //     updatedAt: '2016-01-28T14:59:32.989Z',
      //     _id: '57ac059301a4bb1933fd1878'
      //   }],
      //   insertedCount: 1,
      //   insertedIds: [ '57ac059301a4bb1933fd1878' ]
      // };
      if(err) {
        return callback(err);
      }
      return callback(null, body.ops);
    });
  }

  static createOne(db, collection, doc, callback) {
    doc = helper.fixStringId(doc);
    Create.create(db, collection, doc, (err, body) => {
      if(err) {
        return callback(err);
      }
      return callback(null, body[0]);
    });
  }
}
