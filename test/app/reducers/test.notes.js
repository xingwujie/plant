import * as notes from '../../../app/reducers/notes';
// import * as actions from '../../../app/actions';
import assert from 'assert';

describe('/app/reducers/notes', function() {

  it('should check that all the reducers are in the actions file', (done) => {

    Object.keys(notes.reducers).forEach(reducerKey => {
      // If any of the actions being used in the reducer haven't been defined
      // in the actions file then this test will fail.
      assert(reducerKey !== 'undefined');
    });

    done();
  });

});
