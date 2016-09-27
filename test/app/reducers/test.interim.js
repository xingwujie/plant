const interim = require('../../../app/reducers/interim');
const actions = require('../../../app/actions');
const assert = require('assert');

describe('/app/reducers/interim', function() {

  describe('sanity check', () => {
    it('should check that all the reducers are in the actions file', (done) => {

      Object.keys(interim.reducers).forEach(reducerKey => {
        // If any of the actions being used in the reducer haven't been defined
        // in the actions file then this test will fail.
        assert(reducerKey !== 'undefined');
      });

      done();
    });
  });

  function checkReducer(actionName, state, payload, expected) {
    const action = actions[actionName](payload);
    const actual = interim(state, action);
    assert.deepEqual(actual, expected);
  }

  describe('editNoteOpen', () => {
    it('should reduce from empty state and empty payload', () => {
      const state = {};
      const payload = {};
      const expected = {note: {}};
      checkReducer('editNoteOpen', state, payload, expected);
    });

    it('should reduce from empty state and populated payload', () => {
      const state = {};
      const payload = {a: 1, b: 2};
      const expected = {note: {a: 1, b: 2}};
      checkReducer('editNoteOpen', state, payload, expected);
    });

    it('should reduce from existing state and populated payload', () => {
      const state = {plant: {a: 1}};
      const payload = {a: 1, b: 2};
      const expected = {note: {a: 1, b: 2}, plant: {a: 1}};
      checkReducer('editNoteOpen', state, payload, expected);
    });
  });

  describe('editNoteClose', () => {
    it('should reduce from empty state and empty payload', () => {
      const state = {};
      const payload = {};
      const expected = {};
      checkReducer('editNoteClose', state, payload, expected);
    });

    it('should reduce from empty state and populated payload', () => {
      const state = {};
      const payload = {a: 1, b: 2};
      const expected = {};
      checkReducer('editNoteClose', state, payload, expected);
    });

    it('should reduce from existing state and populated payload', () => {
      const state = {plant: {a: 1}};
      const payload = {a: 1, b: 2};
      const expected = {plant: {a: 1}};
      checkReducer('editNoteClose', state, payload, expected);
    });
  });

  describe('editNoteChange', () => {
    it('should reduce from empty state and empty payload', () => {
      const state = {note: {note: {}, plant: {}}};
      const payload = {};
      const expected = {note: {note: {}, plant: {}}};
      checkReducer('editNoteChange', state, payload, expected);
    });

    it('should reduce from empty state and populated payload', () => {
      const state = {note: {note: {}, plant: {}}};
      const payload = {a: 1, b: 2};
      const expected = {note: {note: {a: 1, b: 2}, plant: {}}};
      checkReducer('editNoteChange', state, payload, expected);
    });

    it('should reduce from existing state and populated payload', () => {
      const state = {note: {note: {a: 11, c: 3}, plant: {}}};
      const payload = {a: 1, b: 2};
      const expected = {note: {note: {a: 1, b: 2, c: 3}, plant: {}}};
      checkReducer('editNoteChange', state, payload, expected);
    });
  });

});
