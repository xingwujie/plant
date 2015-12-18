import _ from 'lodash';
import * as plantValidator from '../../../app/models/plant';
import assert from 'assert';
// import d from 'debug';
// import moment from 'moment';

// const debug = d('plant:test.cloudant');

describe('/app/models/plant', function() {

  it('should pass minimum validation', (done) => {
    const plant = {
      title: 'Title',
      userId: '9ec5c8ffcf885bf372488977ae0d6476'
    };

    plantValidator.validate(plant, (err, transformed) => {
      assert(!err);
      assert.equal(transformed.title, plant.title);
      done();
    });
  });

  it('should pass full validation', (done) => {
    const plant = {
      _id: '0e55d91cb33d420024432d67a3c7fb36',
      botanicalName: 'Botanical Name',
      commonName: 'Common Name',
      description: 'Description',
      plantedDate: '12/15/12',
      price: 25.99,
      purchasedDate: '12/15/12',
      tags: ['citrus', 'north-east'],
      title: 'Title',
      type: 'plant',
      userId: '9ec5c8ffcf885bf372488977ae0d6476',
    };

    plantValidator.validate(plant, (err, transformed) => {
      // debug(err);
      assert(!err);
      assert.deepEqual(Object.keys(transformed), Object.keys(plant));
      // debug('transformed:', transformed);
      assert.deepEqual(transformed, plant);
      done();
    });
  });

  it('should fail validation', (done) => {
    // All items in plant should be invalid
    const plant = {
      _id: '0e55d91cb33d42', // Not a UUID
      botanicalName: _.repeat('Botanical Name is too long', 50),
      commonName: true, // Not a string
      description: 500, // Not a string
      plantedDate: 'Not a Date',
      price: 'Not a number',
      purchasedDate: '55/55/55', // Invalid date
      tags: ['citrus', 'north-east', 'north', 'west', 'south', 'east'], // Tags not unique
      title: {}, // Not a string
      type: 'planter', // Not 'plant'
      userId: 123, // Not a UUID
    };

    plantValidator.validate(plant, (err /*, transformed*/) => {
      assert(err);
      // debug(err);

      assert.equal(err._id, ' id is invalid');

      assert.equal(err.botanicalName, 'Botanical name is too long (maximum is 100 characters)');

      assert.equal(err.commonName, 'Common name has an incorrect length');

      assert.equal(err.description, 'Description has an incorrect length');

      assert.equal(err.plantedDate, 'Planted date must be a valid date');

      assert.equal(err.purchasedDate, 'Purchased date must be a valid date');

      assert.equal(err.tags, 'Tags can have a maximum of 5 tags');

      assert.equal(err.title, 'Title can\'t be blank');

      assert.equal(err.userId, 'User id is invalid');

      done();
    });
  });

  it('should strip out props not in the schema', (done) => {
    const plant = {
      _id: '0e55d91cb33d420024432d67a3c7fb36',
      userId: '9ec5c8ffcf885bf372488977ae0d6476',
      title: 'Title is required',
      fakeName1: 'Common Name',
      fakeName2: 'Description',
    };

    plantValidator.validate(plant, (err, transformed) => {
      // debug('err:', err);
      // debug('transformed:', transformed);

      assert(!err);
      assert.equal(Object.keys(transformed).length, 4);
      assert.equal(transformed._id, plant._id);
      assert.equal(transformed.title, plant.title);
      assert.equal(transformed.type, 'plant');
      assert.equal(transformed.userId, plant.userId);
      assert(!transformed.fakeName1);
      assert(!transformed.fakeName2);
      done();
    });
  });


});
