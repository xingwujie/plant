const users = require('../../../app/reducers/users');
const actions = require('../../../app/actions');
const assert = require('assert');
const Immutable = require('immutable');

function checkReducer(actionName, state, payload, expected) {
  const action = actions[actionName](payload);
  const actual = users(state, action);
  // The following line provides useful debug info which the one after does not
  assert.deepEqual(actual.toJS(), expected.toJS());
  assert(Immutable.is(actual, expected));
}

describe('/app/reducers/users', function() {

  it('should reduce loadUserSuccess action', () => {
    const state = Immutable.fromJS({});
    const payload = {_id: '1', name: 'john'};
    const expected = Immutable.fromJS({
      '1': {_id: '1', name: 'john'}
    });
    checkReducer('loadUserSuccess', state, payload, expected);
  });

  it('should reduce loadUsersSuccess action', () => {
    const state = Immutable.fromJS({});
    const payload = [{_id: '1', name: 'john'}];
    const expected = Immutable.fromJS({
      '1': {_id: '1', name: 'john'}
    });
    checkReducer('loadUsersSuccess', state, payload, expected);
  });

  it('should reduce createPlantRequest action', () => {
    const state = Immutable.fromJS({ 'u1': {_id: 'u1', name: 'john', plantIds: Immutable.Set(['p1'])}});
    const payload = {_id: 'p2', title: 'pt', userId: 'u1'};
    const expected = Immutable.fromJS({
      'u1': {_id: 'u1', name: 'john', plantIds: Immutable.Set(['p1', 'p2'])}
    });
    checkReducer('createPlantRequest', state, payload, expected);
  });

  it('should reduce loadPlantsSuccess action', () => {
    const state = Immutable.fromJS({
      'u1': {
        _id: 'u1',
        name: 'john',
        plantIds: Immutable.Set(['p1.1'])
      },
      'u2': {
        _id: 'u2',
        name: 'jane',
        plantIds: Immutable.Set(['p2.1', 'p2.2'])
      }
    });
    const payload = [
      {_id: 'p1.1', userId: 'u1'},
      {_id: 'p1.2', userId: 'u1'},
      {_id: 'p2.2', userId: 'u2'},
      {_id: 'p2.3', userId: 'u2'},
      {_id: 'p3.1', userId: 'u3'},
    ];
    const expected = Immutable.fromJS({
      'u1': {_id: 'u1', name: 'john', plantIds: Immutable.Set(['p1.1', 'p1.2'])},
      'u2': {_id: 'u2', name: 'jane', plantIds: Immutable.Set(['p2.1', 'p2.2', 'p2.3'])},
    });
    checkReducer('loadPlantsSuccess', state, payload, expected);
  });

  it('should delete a plant', () => {
    const state = Immutable.fromJS({
      'u1': {
        _id: 'u1',
        name: 'john',
        plantIds: Immutable.Set(['p1.1'])
      },
      'u2': {
        _id: 'u2',
        name: 'jane',
        plantIds: Immutable.Set(['p2.1', 'p2.2', 'p2.3'])
      }
    });
    const payload = {userId: 'u2', plantId: 'p2.1'};
    const expected = Immutable.fromJS({
      'u1': {_id: 'u1', name: 'john', plantIds: Immutable.Set(['p1.1'])},
      'u2': {_id: 'u2', name: 'jane', plantIds: Immutable.Set(['p2.2', 'p2.3'])},
    });

    checkReducer('deletePlantRequest', state, payload, expected);

  });
});
