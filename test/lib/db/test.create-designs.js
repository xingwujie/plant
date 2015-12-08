import { createDesigns } from '../../helper';
import * as DesignDB from '../../../lib/db/design-db';
import assert from 'assert';
import d from 'debug';

const debug = d('plant:test.create-designs');

describe('/db/create-designs/', function() {
  this.timeout(10000);

  before((done) => {
    createDesigns(done);
  });

  it('should create the designs', (done) => {
    debug('Creating new Design class 1st time');
    const designDB = new DesignDB.DesignDB();

    designDB.updateAllDesigns((err) => {
      if(err) {
        debug('err:', err);
      }
      assert(!err);
      done();
    });
  });

  it('should create the designs a second time (tests upsert)', (done) => {
    debug('Creating new Design class 2nd time');
    const designDB = new DesignDB.DesignDB();

    designDB.updateAllDesigns((err) => {
      if(err) {
        debug('err:', err);
      }
      assert(!err);
      done();
    });
  });

});
