import _ from 'lodash';
import * as utils from '../../../app/libs/utils';
import constants from '../../../app/libs/constants';
import assert from 'assert';

// import d from 'debug';
// const debug = d('plant:test.utils');

describe('/app/libs/utils', function() {

  it('should create a mongo id', () => {
    const mongoId = utils.makeMongoId();
    // debug('mongoId:', mongoId);
    assert.equal(mongoId.length, 24);
    assert(!_.includes(mongoId, '-'));
    assert(typeof mongoId === 'string');
    assert(constants.mongoIdRE.test(mongoId));
  });

  describe('dateToInt()', () => {
    it('should create an Integer date from date object', () => {
      let actual = utils.dateToInt(new Date('1/1/2016'));
      assert.equal(actual, 20160101);

      actual = utils.dateToInt(new Date('2/29/2016'));
      assert.equal(actual, 20160229);

      actual = utils.dateToInt(new Date('12/31/2016'));
      assert.equal(actual, 20161231);
    });

    it('should create an Integer date from a string', () => {
      let actual = utils.dateToInt('1/1/2016');
      assert.equal(actual, 20160101);

      actual = utils.dateToInt('2/29/2016');
      assert.equal(actual, 20160229);

      actual = utils.dateToInt('12/31/2016');
      assert.equal(actual, 20161231);
    });

    it('should create an Integer date from a string', () => {
      let actual = utils.dateToInt('1/1/2016');
      assert.equal(actual, 20160101);

      actual = utils.dateToInt('2/29/2016');
      assert.equal(actual, 20160229);

      actual = utils.dateToInt('12/31/2016');
      assert.equal(actual, 20161231);
    });

    it('should return an Integer date from an Integer', () => {
      let actual = utils.dateToInt(20160101);
      assert.equal(actual, 20160101);

      actual = utils.dateToInt(20160229);
      assert.equal(actual, 20160229);
    });

    it('should throw and Error for an unknown type', (done) => {
      try {
        utils.dateToInt({});
      }
      catch(e) {
        assert(_.isError(e));
        assert.equal(e.message, 'dateToInt([object Object])');
        done();
      }
    });
  });

  describe('intToDate()', () => {
    it('should create a Date from an Integer', () => {
      function compareDates(act, exp) {
        assert.equal(act.toString(), exp.toString());
      }

      let actual = utils.intToDate(20160101);
      let expected = new Date(2016, 0, 1);
      compareDates(actual, expected);

      actual = utils.intToDate(20160229);
      expected = new Date(2016, 1, 29);
      compareDates(actual, expected);

      actual = utils.intToDate(20161231);
      expected = new Date(2016, 11, 31);
      compareDates(actual, expected);
    });
  });

});
