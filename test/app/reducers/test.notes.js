const notes = require('../../../app/reducers/notes');
const actions = require('../../../app/actions');
const assert = require('assert');
const Immutable = require('immutable');

describe('/app/reducers/notes', function() {

  describe('sanity check', () => {
    it('should check that all the reducers are in the actions file', () => {

      Object.keys(notes.reducers).forEach(reducerKey => {
        // If any of the actions being used in the reducer haven't been defined
        // in the actions file then this test will fail.
        assert(reducerKey !== 'undefined');
      });

    });
  });

  function checkReducer(actionName, state, payload, expected) {
    const action = actions[actionName](payload);
    const actual = notes(state, action);
    // The following line provides useful debug info which the one after does not
    assert.deepEqual(actual.toJS(), expected.toJS());
    assert(Immutable.is(actual, expected));
  }

  describe('reduction', () => {

    it('should upsertNoteRequestSuccess', () => {
      const state = Immutable.fromJS({'id1': {_id: 'id1', date: 20160101}});
      const payload = {note: {_id: 'id2', date: 20160202}};
      const expected = Immutable.fromJS({
        id1: {_id: 'id1', date: 20160101},
        id2: {_id: 'id2', date: 20160202}
      });
      checkReducer('upsertNoteSuccess', state, payload, expected);
      checkReducer('upsertNoteRequest', state, payload, expected);
    });

    it('should loadNotesSuccess', () => {
      const state = Immutable.fromJS({'id1': {_id: 'id1', date: 20160101}});
      const payload = [{_id: 'id2', date: 20160202}, {_id: 'id3', date: 20160303}];
      const expected = Immutable.fromJS({
        id1: {_id: 'id1', date: 20160101},
        id2: {_id: 'id2', date: 20160202},
        id3: {_id: 'id3', date: 20160303}
      });
      checkReducer('loadNotesSuccess', state, payload, expected);
    });
  });

});
