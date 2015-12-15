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

  it.skip('should fail validation', (done) => {
    // All items in plant should be invalid
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
      debug('err:', err);
      debug('transformed:', transformed);
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

});
