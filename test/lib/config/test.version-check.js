import assert from 'assert';
import versionCheck from '../../../lib/config/version-check';

describe('/version-check/', function() {

  it('should check that we are testing with the right version of node', () => {

    assert(versionCheck());

  });

});
