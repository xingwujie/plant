const Helper = require('./helper');

const logger = require('../../logging/logger').create('mongo-create');

module.exports = class Create {
  static create(db, collection, doc, callback) {
    const coll = db.collection(collection);
    coll.insert(Helper.removeEmpty(doc), (err, body) => {
      if (err) {
        return callback(err);
      }
      return callback(null, body.ops);
    });
  }

  static createOne(db, collection, doc, callback) {
    logger.trace('createOne before:', { doc });
    Create.create(db, collection, doc, (err, body) => {
      if (err) {
        return callback(err);
      }
      logger.trace('createOne after:', { body });

      return callback(null, body[0]);
    });
  }
};
