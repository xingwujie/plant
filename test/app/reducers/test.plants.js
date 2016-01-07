import plants from '../../../app/reducers/plants';
import * as actions from '../../../app/actions';
import assert from 'assert';

describe('/app/reducers/plants', function() {

  it('should reduce a create plant request', (done) => {
    const current = [{
      _id: '1',
      name: 'one'
    }];
    const payload = {
      _id: '2',
      name: 'two'
    };
    const expected = [...current, payload];
    const actual = plants(current, actions.addPlant(payload));

    // Check
    assert.deepEqual(actual, expected);
    done();
  });

});
