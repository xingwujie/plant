import plants from '../../../app/reducers/plants';
import * as actions from '../../../app/actions';
import assert from 'assert';

describe('/app/reducers/plants', function() {

  it('should reduce a create plant request', (done) => {
    const current = {
      '1': {
        _id: '1',
        name: 'one'
      }
    };
    const payload = {
      _id: '2',
      name: 'two'
    };
    const expected = Object.assign({}, current, {'2': payload});
    const actual = plants(current, actions.createPlantRequest(payload));

    // Check
    assert.deepEqual(actual, expected);
    done();
  });

});
