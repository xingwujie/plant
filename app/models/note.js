import _ from 'lodash';
import {makeMongoId} from '../libs/utils';
import constants from '../libs/constants';
import validatejs from 'validate.js';

// import d from 'debug';
// const debug = d('plant:test.plant');

validatejs.validators.plantIdsValidate = (value, options /*, key, attributes */) => {
  // plantId array rules:
  // 1. is present
  // 2. is array
  // 3. min length 1
  // 4. each item is uuid

  if(!value) {
    return 'is required';
  }

  if(!_.isArray(value)) {
    return 'must be an array';
  }

  const minarray = _.get(options, 'length.minimum');
  if(minarray && value.length < minarray) {
    return `must have at least ${minarray} on plant associated`;
  }

  // Only uuid values of x length
  const validInner = _.every(value, item => {
    return item && item.length === 24 && constants.mongoIdRE.test(item);
  });

  if(!validInner) {
    return 'must be UUIDs';
  }

};

function transform(attributes) {
  return attributes;
}


// Don't need an _id if we're creating a document, db will do this.
// Don't need a userId if we're in the client, this will get added on the server
// to prevent tampering with the logged in user.
export default (attributes, {isNew}, cb) => {

  const constraints = {
    _id: {format: constants.mongoIdRE, presence: true},
    date: {datetime: true, presence: true},
    plantIds: {plantIdsValidate: {length: {minimum: 1}}},
    note: {length: {minimum: 1, maximum: 5000}, presence: true},
    userId: {format: constants.mongoIdRE, presence: true},
  };

  if(isNew && !attributes._id) {
    attributes = {...attributes, _id: makeMongoId()};
  }

  // debug('attributes:', attributes);
  const cleaned = validatejs.cleanAttributes(_.clone(attributes), constraints);
  // debug('cleaned:', cleaned);
  const transformed = transform(cleaned);
  // debug('transformed:', transformed);
  const errors = validatejs.validate(transformed, constraints);
  const flatErrors = errors && errors.length > 0
    ? errors.map( (value, key) => {return {[key]: value[0]};} )
    : errors;
  cb(flatErrors, transformed);
};
