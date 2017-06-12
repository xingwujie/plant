const _ = require('lodash');
const utils = require('../../../app/libs/utils');
const constants = require('../../../app/libs/constants');
const assert = require('assert');
const moment = require('moment');

describe('/app/libs/utils', () => {
  describe('slugs', () => {
    it('should create a slug', () => {
      const given = '  I/am(a)slug  ';
      const actual = utils.makeSlug(given);
      const expected = 'i-am-a-slug';
      assert.equal(actual, expected);
    });
  });

  describe('mongo', () => {
    it('should create a mongo id', () => {
      const mongoId = utils.makeMongoId();
      assert.equal(mongoId.length, 24);
      assert(!_.includes(mongoId, '-'));
      assert(typeof mongoId === 'string');
      assert(constants.mongoIdRE.test(mongoId));
    });
  });

  describe('dateToInt()', () => {
    it('should create an Integer date from moment object', () => {
      let actual = utils.dateToInt(moment(new Date('1/1/2016')));
      assert.equal(actual, 20160101);

      actual = utils.dateToInt(moment(new Date('2/29/2016')));
      assert.equal(actual, 20160229);

      actual = utils.dateToInt(moment(new Date('12/31/2016')));
      assert.equal(actual, 20161231);
    });

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

      actual = utils.dateToInt('13/02/1987');
      assert(_.isNaN(actual));
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
      } catch (e) {
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

  describe('rebaseLocations', () => {
    it('should rebase the locations', () => {
      const plants = [{
        _id: '1',
        loc: { coordinates: [5.5, 10.1] },
      }, {
        _id: '2',
        loc: { coordinates: [15.15, 35.35] },
      }, {
        _id: '3',
        loc: { coordinates: [10.1, 4.4] },
      }];
      const rebased = utils.rebaseLocations(plants);
      assert.equal(rebased[0].loc.coordinates[0], 0);
      assert.equal(rebased[0].loc.coordinates[1], 5.7);
      assert.equal(rebased[1].loc.coordinates[0], 9.65);
      assert.equal(rebased[1].loc.coordinates[1], 30.95);
      assert.equal(rebased[2].loc.coordinates[0], 4.6);
      assert.equal(rebased[2].loc.coordinates[1], 0);
    });
  });

  describe('metrics', () => {
    it('should prepare note body and remove unknow metrics', () => {
      const body = {
        date: '20160101',
        metrics: {
          height: '15.5',
          harvestCount: '32',
          harvestStart: 'true',
          invalidProp: '66',
        },
      };
      const actual = utils.noteFromBody(body);
      const expected = {
        date: 20160101,
        metrics: {
          height: 15.5,
          harvestCount: 32,
          harvestStart: true,
        },
      };
      assert.deepEqual(actual, expected);
    });

    it('should prepare note body and remove invalid metrics', () => {
      const body = {
        date: '20160101',
        metrics: {
          height: 'invalid float',
          harvestCount: 'invalid number',
          harvestStart: 'anything not "true" should be removed',
        },
      };
      const actual = utils.noteFromBody(body);
      const expected = {
        date: 20160101,
      };
      assert.deepEqual(actual, expected);
    });
  });
});
