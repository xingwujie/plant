import _ from 'lodash';

// import d from 'debug';
// const debug = d('plant:mongo-helper');

export default class Helper {

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

}
