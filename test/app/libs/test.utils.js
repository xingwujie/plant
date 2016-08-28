import _ from 'lodash';
import * as utils from '../../../app/libs/utils';
import constants from '../../../app/libs/constants';
import assert from 'assert';

// import d from 'debug';
// const debug = d('plant:test.utils');

describe('/app/libs/utils', function() {

  it('should create a mongo id', (done) => {
    const mongoId = utils.makeMongoId();
    // debug('mongoId:', mongoId);
    assert.equal(mongoId.length, 24);
    assert(!_.includes(mongoId, '-'));
    assert(typeof mongoId === 'string');
    assert(constants.mongoIdRE.test(mongoId));
    done();
  });

});
