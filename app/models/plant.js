const cloneDeep = require('lodash/cloneDeep');
const trim = require('lodash/trim');
const isArray = require('lodash/isArray');
const uniq = require('lodash/uniq');
const every = require('lodash/every');
const {makeMongoId} = require('../libs/utils');
const constants = require('../libs/constants');
const validatejs = require('validate.js');

//  The validator receives the following arguments:
//     value - The value exactly how it looks in the attribute object.
//     options - The options for the validator. Guaranteed to not be null or undefined.
//     key - The attribute name.
//     attributes - The entire attributes object.
//     globalOptions - The options passed when calling validate (will always be an object, non null).
//
// If the validator passes simply return null or undefined. Otherwise return a string or an array of strings containing the error message(s).
// Make sure not to append the key name, this will be done automatically.
validatejs.validators.tagValidate = (value, /*options, key, attributes */) => {
  // tags array rules:
  // 1. lowercase alpha and -
  const validRegex = /^[a-z-]*$/;
  // 2. unique array of strings
  // 3. max length of array: 5
  const maxTags = 5;
  // 4. max length of each string: 20
  const maxTagLength = 20;
  // 5. optional

  if(!value) {
    return null;
  }

  if(!isArray(value)) {
    return 'must be an array';
  }

  if(maxTags && value.length > maxTags) {
    return `can have a maximum of ${maxTags} tags`;
  }

  if(maxTagLength && value.length > 0) {
    const maxlen = value.reduce( (prev, item) => {
      return Math.max(prev, item.length);
    }, 0);
    if(maxlen > maxTagLength) {
      return `cannot be more than ${maxTagLength} characters`;
    }
  }

  // Only a to z and '-'
  if(!every(value, item => {return validRegex.test(item); })) {
    return 'can only have alphabetic characters and a dash';
  }

};

// export const fieldNames = Object.keys(constraints);

// Intentionally mutates object
// Transform:
// 1. Lowercase elements of array
// 2. Apply unique to array which might reduce length of array
function transform(attributes) {
  if(attributes.tags && isArray(attributes.tags)) {
    attributes.tags = uniq(attributes.tags.map(tag => { return tag.toLowerCase(); }));
  }

  // If any amounts are preceded by a $ sign then trim that.
  if(attributes.price && typeof attributes.price === 'string') {
    attributes.price = +trim(attributes.price, '$');
  }

  return attributes;
}

// Don't need an _id if we're creating a document, db will do this.
// Don't need a userId if we're in the client, this will get added on the server
// to prevent tampering with the logged in user.
module.exports = (attributes, {isNew}, cb) => {

  const constraints = {
    _id: {format: constants.mongoIdRE, presence: true},
    botanicalName: {length: {maximum: 100}},
    commonName:  {length: {maximum: 100}},
    description: {length: {maximum: 500}},
    plantedDate: {intDateValidate: {presence: false}},
    price: {numericality: {noStrings: true}},
    purchasedDate: {intDateValidate: {presence: false}},
    tags: {tagValidate: {}},
    title: {length: {minimum: 1, maximum: 100}, presence: true},
    userId: {format: constants.mongoIdRE, presence: true},
  };

  if(isNew && !attributes._id) {
    attributes = {...attributes, _id: makeMongoId()};
  }

  // debug('attributes:', attributes);
  const cleaned = validatejs.cleanAttributes(cloneDeep(attributes), constraints);
  // debug('cleaned:', cleaned);
  const transformed = transform(cleaned);
  // debug('transformed:', transformed);
  const errors = validatejs.validate(transformed, constraints);
  // debug('errors:', errors);
  const flatErrors = errors && errors.length > 0
    ? errors.map( (value, key) => {return {[key]: value[0]};} )
    : errors;
  cb(flatErrors, transformed);
};
