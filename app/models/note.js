const cloneDeep = require('lodash/cloneDeep');
const omit = require('lodash/omit');
const isArray = require('lodash/isArray');
const every = require('lodash/every');
const {makeMongoId} = require('../libs/utils');
const constants = require('../libs/constants');
const validatejs = require('validate.js');

validatejs.validators.plantIdsValidate = (value, options /*, key, attributes */) => {
  // plantId array rules:
  // 1. is present
  // 2. is array
  // 3. min length 1
  // 4. each item is uuid

  if(!value) {
    return 'is required';
  }

  if(!isArray(value)) {
    return 'must be an array';
  }

  const minarray = options && options.length && options.length.minimum;
  if(minarray && value.length < minarray) {
    return `must have at least ${minarray} on plant associated`;
  }

  // Only mongoId values of x length
  const validInner = every(value, item => {
    return item && item.length === 24 && constants.mongoIdRE.test(item);
  });

  if(!validInner) {
    return 'must be MongoIds';
  }

};

function transform(attributes) {
  return attributes;
}

// Validate the parts of the images array
validatejs.validators.imagesValidate = (value) => {
  if(!value) {
    // images is optional so return if not exist
    return;
  }

  if(!isArray(value)) {
    return 'must be an array';
  }

  // Only uuid values of x length
  const validImageObject = every(value, item => {
    return item
      && constants.mongoIdRE.test(item.id)
      && typeof item.ext === 'string'
      && typeof item.originalname === 'string'
      && typeof item.size === 'number'
      && item.ext.length <= 20
      && item.originalname.length <= 500;
  });

  if(!validImageObject) {
    return 'must be valid image objects';
  }

  const allowedProps = ['id', 'ext', 'originalname', 'size', 'sizes'];

  let extraProps;
  const validProps = every(value, item => {
    // Make sure no extra keys inserted
    extraProps = omit(item, allowedProps);
    return Object.keys(extraProps).length === 0;
  });

  if(!validProps) {
    return `must only have the following allowed props: ${allowedProps.join()} and found these props as well: ${Object.keys(extraProps).join()}`;
  }

  // Check the sizes array if there is one
  const names = constants.imageSizeNames;
  const validSizes = every(value, item => {
    if(item.sizes) {
      return every(item.sizes, size => {
        console.log('size:', size);
        return names.indexOf(size.name) >= 0 &&
          typeof size.width === 'number';
      });
    } else {
      return true;
    }
  });

  if(!validSizes) {
    return 'must be valid sizes in the image';
  }

};

// Don't need an _id if we're creating a document, db will do this.
// Don't need a userId if we're in the client, this will get added on the server
// to prevent tampering with the logged in user.
module.exports = (attributes, cb) => {

  const constraints = {
    _id: {format: constants.mongoIdRE, presence: true},
    date: {intDateValidate: {presence: true}},
    images: {imagesValidate: {}},
    plantIds: {plantIdsValidate: {length: {minimum: 1}}},
    note: {length: {minimum: 1, maximum: 5000}, presence: false},
  };

  attributes = cloneDeep(attributes);
  attributes._id = attributes._id || makeMongoId();

  if(isArray(attributes.images)) {
    attributes = Object.assign({},
      attributes,
      {images: attributes.images.map(image => {
        if(image.sizes && image.size.length) {
          image.sizes = image.sizes.map(({name: widthName, width}) => {
            return {
              name: widthName,
              width: parseInt(width, 10)
            };
          });
        }
        return Object.assign({},
          image,
          {size: parseInt(image.size, 10)
        });
      })}
    );
  }

  // debug('attributes:', attributes);
  const cleaned = validatejs.cleanAttributes(cloneDeep(attributes), constraints);
  // debug('cleaned:', cleaned);
  const transformed = transform(cleaned);
  // debug('transformed:', transformed);
  const errors = validatejs.validate(transformed, constraints);
  const flatErrors = errors && errors.length > 0
    ? errors.map( (value, key) => {return {[key]: value[0]};} )
    : errors;
  cb(flatErrors, transformed);
};
