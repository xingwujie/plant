import _ from 'lodash';
import {makeCouchId} from '../libs/utils';
import constants from '../libs/constants';
import validatejs from 'validate.js';

// import d from 'debug';
// const debug = d('plant:test.plant');

function transform(attributes) {
  return {
    ...attributes,
    type: 'note'
  };
}


// Don't need an _id if we're creating a document, db will do this.
// Don't need a userId if we're in the client, this will get added on the server
// to prevent tampering with the logged in user.
export default (attributes, {isNew}, cb) => {

  const constraints = {
    _id: {format: constants.uuidRE, presence: true},
    date: {datetime: true, presence: true},
    plantId: {format: constants.uuidRE, presence: true},
    note: {length: {minimum: 1, maximum: 5000}, presence: true},
    type: {inclusion: ['note'], presence: true},
    userId: {format: constants.uuidRE, presence: true},
  };

  if(isNew && !attributes._id) {
    attributes = {...attributes, _id: makeCouchId()};
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
