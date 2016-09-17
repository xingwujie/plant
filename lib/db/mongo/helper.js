const _ = require('lodash');

// const logger = require('../../logging/logger').create('mongo-helper');

module.exports = class Helper {

  static removeEmpty(doc) {
    if(!doc) {
      return doc;
    }
    if(_.isArray(doc)) {
      return doc.map(item => Helper.removeEmpty(item));
    } else {
      return _.pickBy(doc, item => item !== '');
    }
  }

};
