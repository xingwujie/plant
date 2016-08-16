import _ from 'lodash';
import {makeMongoId} from '../libs/utils';
import constants from '../libs/constants';
import validatejs from 'validate.js';

// import d from 'debug';
// const debug = d('plant:model.plant');

//  The validator receives the following arguments:
//     value - The value exactly how it looks in the attribute object.
//     options - The options for the validator. Guaranteed to not be null or undefined.
//     key - The attribute name.
//     attributes - The entire attributes object.
//     globalOptions - The options passed when calling validate (will always be an object, non null).
//
// If the validator passes simply return null or undefined. Otherwise return a string or an array of strings containing the error message(s).
// Make sure not to append the key name, this will be done automatically.
validatejs.validators.tagValidate = (value, options /*, key, attributes */) => {
  // tags array rules:
  // 1. lowercase alpha and -
  // 2. unique array of strings
  // 3. max length of array: 5
  // 4. max length of each string: 20
  // 5. optional

  if(!value) {
    return null;
  }

  if(!_.isArray(value)) {
    return 'must be an array';
  }

  const maxarray = _.get(options, 'length.maximum');
  if(maxarray && value.length > maxarray) {
    return `can have a maximum of ${maxarray} tags`;
  }

  const innermax = _.get(options, 'length.innermax');
  if(innermax && value.length > 0) {
    const maxlen = value.reduce( (prev, item) => {
      return Math.max(prev, item.length);
    }, 0);
    if(maxlen > innermax) {
      return `cannot be more than ${innermax} characters`;
    }
  }

  // Only a to z and '-'
  if(!_.every(value, item => {return /^[a-z-]*$/.test(item); })) {
    return 'can only have alphabetic characters and a dash';
  }

};

// export const fieldNames = Object.keys(constraints);

// Intentionally mutates object
// Transform:
// 1. Lowercase elements of array
// 2. Apply unique to array which might reduce length of array
function transform(attributes) {
  if(attributes.tags && _.isArray(attributes.tags)) {
    attributes.tags = _.uniq(attributes.tags.map(tag => { return tag.toLowerCase(); }));
  }

  return attributes;
}

// Don't need an _id if we're creating a document, db will do this.
// Don't need a userId if we're in the client, this will get added on the server
// to prevent tampering with the logged in user.
export default (attributes, {isNew}, cb) => {

  const constraints = {
    _id: {format: constants.mongoIdRE, presence: true},
    botanicalName: {length: {maximum: 100}},
    commonName:  {length: {maximum: 100}},
    description: {length: {maximum: 500}},
    plantedDate: {datetime: true},
    price: {numericality: true},
    purchasedDate: {datetime: true},
    tags: {tagValidate: {length: {maximum: 5, innermax: 20}, unique: true, format: /[a-z-]/}},
    title: {length: {minimum: 1, maximum: 100}, presence: true},
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
