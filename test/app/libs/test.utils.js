import _ from 'lodash';
import * as utils from '../../../app/libs/utils';
import assert from 'assert';

// import d from 'debug';
// const debug = d('plant:test.utils');

describe('/app/libs/utils', function() {

  it('should create a couch id', (done) => {
    const couchId = utils.makeCouchId();
    // debug('couchId:', couchId);
    assert.equal(couchId.length, 32);
    assert(!_.includes(couchId, '-'));
    done();
  });

});
