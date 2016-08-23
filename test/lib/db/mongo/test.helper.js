import Helper from '../../../../lib/db/mongo/helper';
import assert from 'assert';

import d from 'debug';
const debug = d('plant:test.mongo-helper');

describe('/lib/db/mongo/helper', function() {
  this.timeout(10000);

  describe('removeEmtpy', () => {
    it('should remove empty string values', () => {
      const doc = {
        one: 'one',
        two: '',
        three: 0,
        four: false
      };
      const rDoc = Helper.removeEmpty(doc);
      debug('rDoc:', rDoc);
      assert.deepEqual(rDoc, {
        one: 'one',
        three: 0,
        four: false
      });
    });

  });
});
