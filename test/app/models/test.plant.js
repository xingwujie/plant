const _ = require('lodash');
const validators = require('../../../app/models');
const assert = require('assert');

const plantValidator = validators.plant;

const logger = require('../../../lib/logging/logger').create('plant:test.plant');

describe('/app/models/plant', function() {

  it('should pass minimum validation', (done) => {
    const plant = {
      _id: 'b33d420024432d67a3c7fb36',
      title: 'Title',
      userId: 'cf885bf372488977ae0d6476',
      price: '$19.99' // should convert this to numeric 19.99
    };
    const plantCopy = _.clone(plant);

    const isNew = false;

    plantValidator(plant, {isNew}, (err, transformed) => {
      assert(!err);
      assert.equal(transformed.title, plant.title);
      assert.deepEqual(plantCopy, plant);
      assert.equal(transformed.price, 19.99);
      done();
    });
  });

  it('should pass full validation', (done) => {
    const plant = {
      _id: 'b33d420024432d67a3c7fb36',
      botanicalName: 'Botanical Name',
      commonName: 'Common Name',
      description: 'Description',
      plantedDate: 20121215,
      price: 25.99,
      purchasedDate: 20121215,
      tags: ['citrus', 'north-east'],
      title: 'Title',
      userId: 'cf885bf372488977ae0d6476',
    };
    const plantCopy = _.clone(plant);

    const isNew = false;

    plantValidator(plant, {isNew}, (err, transformed) => {

      assert(!err);
      assert.deepEqual(Object.keys(transformed), Object.keys(plant));
      logger.trace('transformed:', {transformed});
      assert.deepEqual(transformed, plant);
      assert.deepEqual(plantCopy, plant);
      done();
    });
  });

  it('should fail validation', (done) => {
    // All items in plant should be invalid
    const plant = {
      _id: '0e55d91cb33d42', // Not a MongoId
      botanicalName: _.repeat('Botanical Name is too long', 50),
      commonName: true, // Not a string
      description: 500, // Not a string
      plantedDate: 121212, // Year is not 4 digits
      price: 'Not a number',
      purchasedDate: 20161313, // Invalid month
      tags: ['citrus', 'north-east', 'north', 'west', 'south', 'east'], // Tags not unique
      title: {}, // Not a string
      userId: 123, // Not a MongoId
    };
    const plantCopy = _.clone(plant);

    const isNew = false;

    plantValidator(plant, {isNew}, (err /*, transformed*/) => {
      assert(err);

      assert.equal(err._id, ' id is invalid');
      assert.equal(err.botanicalName, 'Botanical name is too long (maximum is 100 characters)');
      assert.equal(err.commonName, 'Common name has an incorrect length');
      assert.equal(err.description, 'Description has an incorrect length');
      assert.equal(err.plantedDate, 'Planted date must be after 1st Jan 1700');
      assert.equal(err.price, 'Price is not a number');
      assert.equal(err.purchasedDate, 'Acquire date must have a valid month, value found was 13');
      assert.equal(err.tags, 'Tags can have a maximum of 5 tags');
      assert.equal(err.title, 'Title can\'t be blank');
      assert.equal(err.userId, 'User id is invalid');
      assert.deepEqual(plantCopy, plant);
      done();
    });
  });

  it('should strip out props not in the schema', (done) => {
    const plant = {
      _id: 'b33d420024432d67a3c7fb36',
      userId: 'cf885bf372488977ae0d6476',
      title: 'Title is required',
      fakeName1: 'Common Name',
      fakeName2: 'Description',
    };
    const plantCopy = _.clone(plant);

    const isNew = false;

    plantValidator(plant, {isNew}, (err, transformed) => {

      assert(!err);
      assert.equal(Object.keys(transformed).length, 3);
      assert.equal(transformed._id, plant._id);
      assert.equal(transformed.title, plant.title);
      assert.equal(transformed.userId, plant.userId);
      assert(!transformed.fakeName1);
      assert(!transformed.fakeName2);
      assert.deepEqual(plantCopy, plant);
      done();
    });
  });

  it('should add _id if it is a new record', (done) => {
    const plant = {
      userId: 'cf885bf372488977ae0d6476',
      title: 'Title is required'
    };
    const plantCopy = _.clone(plant);

    const isNew = true;
    plantValidator(plant, {isNew}, (err, transformed) => {

      assert(!err);
      assert.equal(Object.keys(transformed).length, 3);
      assert(transformed._id);
      assert.equal(transformed.title, plant.title);
      assert.equal(transformed.userId, plant.userId);
      assert.deepEqual(plantCopy, plant);
      done();
    });
  });

  it('should fail if userId is missing', (done) => {
    const plant = {
      _id: 'b33d420024432d67a3c7fb36',
      title: 'Title is required'
    };
    const plantCopy = _.clone(plant);

    const isNew = false;

    plantValidator(plant, {isNew}, (err, transformed) => {

      assert(err);
      assert.equal(err.userId, 'User id can\'t be blank');
      assert.equal(Object.keys(transformed).length, 2);
      assert.equal(transformed._id, plant._id);
      assert.equal(transformed.title, plant.title);
      assert(!transformed.userId);
      assert.deepEqual(plantCopy, plant);
      done();
    });
  });

  it('should fail if a tag element is over its maximum length', (done) => {
    const plant = {
      _id: 'b33d420024432d67a3c7fb36',
      botanicalName: 'Botanical Name',
      commonName: 'Common Name',
      description: 'Description',
      plantedDate: 20121215,
      price: 25.99,
      purchasedDate: 20121215,
      tags: ['citrus', '01234567890012345678901'],
      title: 'Title',
      userId: 'cf885bf372488977ae0d6476',
    };
    const plantCopy = _.clone(plant);

    const isNew = false;

    plantValidator(plant, {isNew}, (err, transformed) => {

      assert(err);
      assert.equal(err.tags, 'Tags cannot be more than 20 characters');
      assert.deepEqual(Object.keys(transformed), Object.keys(plant));
      assert.deepEqual(transformed, plant);
      assert.deepEqual(plantCopy, plant);
      done();
    });
  });

  it('should fail if a tags is not an array', (done) => {
    const plant = {
      _id: 'b33d420024432d67a3c7fb36',
      botanicalName: 'Botanical Name',
      commonName: 'Common Name',
      description: 'Description',
      plantedDate: 20121215,
      price: 25.99,
      purchasedDate: 20121215,
      tags: 'citrus',
      title: 'Title',
      userId: 'cf885bf372488977ae0d6476',
    };
    const plantCopy = _.clone(plant);

    const isNew = false;

    plantValidator(plant, {isNew}, (err, transformed) => {

      assert(err);
      assert.equal(err.tags, 'Tags must be an array');
      assert.deepEqual(Object.keys(transformed), Object.keys(plant));
      assert.deepEqual(transformed, plant);
      assert.deepEqual(plantCopy, plant);
      done();
    });
  });

  it('should fail if a tag element has invalid characters', (done) => {
    const plant = {
      _id: 'b33d420024432d67a3c7fb36',
      botanicalName: 'Botanical Name',
      commonName: 'Common Name',
      description: 'Description',
      plantedDate: 20121215,
      price: 25.99,
      purchasedDate: 20121215,
      tags: ['cit&rus'],
      title: 'Title',
      userId: 'cf885bf372488977ae0d6476',
    };
    const plantCopy = _.clone(plant);

    const isNew = false;

    plantValidator(plant, {isNew}, (err, transformed) => {

      assert(err);
      assert.equal(err.tags, 'Tags can only have alphabetic characters and a dash');
      assert.deepEqual(Object.keys(transformed), Object.keys(plant));
      assert.deepEqual(transformed, plant);
      assert.deepEqual(plantCopy, plant);
      done();
    });
  });

  it('should lowercase tags', (done) => {
    const plant = {
      _id: 'b33d420024432d67a3c7fb36',
      botanicalName: 'Botanical Name',
      commonName: 'Common Name',
      description: 'Description',
      plantedDate: 20121215,
      price: 25.99,
      purchasedDate: 20121215,
      tags: ['CITRUS', 'North-West', 'upPer'],
      title: 'Title',
      userId: 'cf885bf372488977ae0d6476',
    };
    const plantCopy = _.clone(plant);

    const isNew = false;

    plantValidator(plant, {isNew}, (err, transformed) => {
      assert(!err);
      assert.deepEqual(Object.keys(transformed), Object.keys(plant));
      assert.deepEqual(transformed.tags, ['citrus', 'north-west', 'upper']);
      assert.deepEqual(plantCopy, plant);
      done();
    });
  });

});
