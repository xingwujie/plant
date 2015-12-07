import * as DesignDB from '../../../lib/db/design-db';
import assert from 'assert';
import d from 'debug';

const debug = d('plant:test.create-designs');

describe.only('/db/create-designs/', function() {
  this.timeout(5000);

  it('should create the designs', (done) => {
    debug('Creating new Design class');
    const designDB = new DesignDB.DesignDB();

    designDB.createAllDesigns((err) => {
      if(err) {
        debug('err:', err);
      }
      assert(!err);
      done();
    });
  });

});
