const _ = require('lodash');
const plants = require('../../../app/reducers/plants');
const actions = require('../../../app/actions');
const assert = require('assert');

describe('/app/reducers/plants', function() {
  describe('similar methods', () => {
    const methods = [
      'createPlantRequest',
      'createPlantFailure',
      'deletePlantFailure',
      'updatePlantFailure',
      'updatePlantRequest',
      'loadPlantFailure'
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

    it('should reduce with existing with replace in place', () => {
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

  it('should delete a note', () => {
    const current = {
      '1': {
        _id: '1',
        name: 'one',
        notes: ['n1', 'n2', 'n3']
      },
      '2': {
        _id: '2',
        name: 'xxx',
        notes: ['n1', 'n2', 'n3']
      }
    };
    const payload = 'n2';
    const expected = _.cloneDeep(current);
    expected['1'].notes.splice(1, 1);
    expected['2'].notes.splice(1, 1);

    const actual = plants(current, actions.deleteNoteRequest(payload));
    assert.deepEqual(actual, expected);
  });

  it('should load a plant', () => {
    const current = {
      '1': {
        _id: '1',
        name: 'one',
        notes: ['n1', 'n2', 'n3']
      },
      '2': {
        _id: '2',
        name: 'xxx',
        notes: ['n1', 'n2', 'n3']
      }
    };
    const payload = {
      _id: '3',
      name: 'three',
      notes: [{_id: 'n1', junk: 'x'}, {_id: 'n2', morejunk: 'xx'}]
    };
    const expected = Object.assign({}, _.cloneDeep(current), {'3': _.cloneDeep(payload)});
    expected['3'].notes = ['n1', 'n2'];

    const actual = plants(current, actions.loadPlantSuccess(payload));

    assert.deepEqual(actual, expected);
  });

  it('should load multiple plants', () => {
    const current = {
      '1': {
        _id: '1',
        name: 'one',
        notes: ['n1', 'n2', 'n3']
      },
      '2': {
        _id: '2',
        name: 'xxx',
        notes: ['n1', 'n2', 'n3']
      }
    };
    const payload = [{
      _id: '3',
      name: 'three',
      notes: [{_id: 'n1', junk: 'x'}, {_id: 'n2', morejunk: 'xx'}]
    }];
    const expected = Object.assign({}, _.cloneDeep(current), {'3': _.cloneDeep(payload[0])});
    expected['3'].notes = ['n1', 'n2'];


    const actual = plants(current, actions.loadPlantsSuccess(payload));
    assert.deepEqual(actual, expected);
  });

});
