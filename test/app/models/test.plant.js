import _ from 'lodash';
import * as plantValidator from '../../../app/models/plant';
import assert from 'assert';
import d from 'debug';
import moment from 'moment';

const debug = d('plant:test.cloudant');

describe('/app/models/plant', function() {

  it('should pass minimum validation', (done) => {
    const plant = {
      title: 'Title'
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
      assert(!err);
      assert.deepEqual(Object.keys(transformed), Object.keys(plant));
      _.each(plant, (value, key) => {
        if(plantValidator.schema[key]._type === 'date') {
          assert(moment(new Date(value)).isSame(transformed[key]));
          // debug('transformed:', transformed[key]);
        } else if(plantValidator.schema[key]._type === 'array') {
          assert.deepEqual(transformed[key], value);
        } else {
          assert.equal(transformed[key], value);
        }
      });
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
      tags: ['citrus', 'north-east', 'north-east'], // Tags not unique
      title: {}, // Not a string
      type: 'planter', // Not 'plant'
      userId: 123, // Not a UUID
    };

    plantValidator.validate(plant, (err /*, transformed*/) => {
      assert(err);

      const plantKeys = Object.keys(plant);
      const errDetailKeys = err.details.map(detail => detail.path);
      assert.deepEqual(plantKeys, errDetailKeys);

      let _id = _.find(err.details, detail => detail.path === '_id');
      assert.equal(_id.message, '"_id" must be a valid GUID');

      let botanicalName = _.find(err.details, detail => detail.path === 'botanicalName');
      assert.equal(botanicalName.message, '"botanicalName" length must be less than or equal to 100 characters long');

      let commonName = _.find(err.details, detail => detail.path === 'commonName');
      assert.equal(commonName.message, '"commonName" must be a string');

      let description = _.find(err.details, detail => detail.path === 'description');
      assert.equal(description.message, '"description" must be a string');

      let plantedDate = _.find(err.details, detail => detail.path === 'plantedDate');
      assert.equal(plantedDate.message, '"plantedDate" must be a number of milliseconds or valid date string');

      let purchasedDate = _.find(err.details, detail => detail.path === 'purchasedDate');
      assert.equal(purchasedDate.message, '"purchasedDate" must be a number of milliseconds or valid date string');

      let tags = _.find(err.details, detail => detail.path === 'tags');
      assert.equal(tags.message, '"tags" position 2 contains a duplicate value');

      let title = _.find(err.details, detail => detail.path === 'title');
      assert.equal(title.message, '"title" must be a string');

      let userId = _.find(err.details, detail => detail.path === 'userId');
      assert.equal(userId.message, '"userId" must be a string');

      done();
    });
  });

  it('should strip out props not in the schema', (done) => {
    const plant = {
      _id: '0e55d91cb33d420024432d67a3c7fb36',
      title: 'Title is required',
      fakeName1: 'Common Name',
      fakeName2: 'Description',
    };

    plantValidator.validate(plant, (err, transformed) => {
      // debug('err:', err);
      // debug('transformed:', transformed);

      assert(!err);
      assert.equal(Object.keys(transformed).length, 2);
      assert(transformed._id);
      assert(transformed.title);
      assert(!transformed.fakeName1);
      assert(!transformed.fakeName2);
      done();
    });
  });


});
