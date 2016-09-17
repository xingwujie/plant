const _ = require('lodash');
const plants = require('../../../app/reducers/plants');
const actions = require('../../../app/actions');
const assert = require('assert');

describe.only('/app/reducers/plants', function() {
  describe('similar methods', () => {
    const methods = [
      'createPlantRequest',
      'createPlantFailure',
      'deletePlantFailure',
      'updatePlantFailure',
      'updatePlantRequest'
    ];

    it('should reduce using replace in place', () => {
      const current = Object.freeze({
        '1': {
          _id: '1',
          name: 'one'
        }
      });
      const payload = {
        _id: '2',
        name: 'two'
      };
      const expected = Object.assign({}, current, {'2': payload});

      methods.forEach(method => {
        const actual = plants(current, actions[method](payload));
        assert.deepEqual(actual, expected);
      });

    });

    it('should reduce a create plant request', () => {
      const current = Object.freeze({
        '1': {
          _id: '1',
          name: 'one'
        },
        '2': {
          _id: '2',
          name: 'xxx'
        }
      });
      const payload = {
        _id: '2',
        name: 'two'
      };
      const expected = Object.assign({}, current, {'2': payload});

      methods.forEach(method => {
        const actual = plants(current, actions[method](payload));
        assert.deepEqual(actual, expected);
      });

    });

    it('should delete a plant', () => {
      const current = {
        '1': {
          _id: '1',
          name: 'one'
        },
        '2': {
          _id: '2',
          name: 'xxx'
        }
      };
      const payload = '2';
      const expected = _.cloneDeep(current);
      delete expected['2'];

      const actual = plants(current, actions.deletePlantRequest(payload));
      assert.deepEqual(actual, expected);

    });

  });

});
