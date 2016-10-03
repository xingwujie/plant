// const _ = require('lodash');
const assert = require('assert');
const proxyquire = require('proxyquire');

describe('Logger', () => {

  describe('Basic logging', () =>{
    const Logger = require('../../../lib/logging/logger');
    it('should set/get the log levels', () => {
      let level = 'trace';
      Logger.setLevel(level);
      assert.equal(level, Logger.getLevel());

      level = 'security';
      Logger.setLevel(level);
      assert.equal(level, Logger.getLevel());
    });

    it('should fail to change the log level if it is misspelled', () => {
      let level = 'trace';
      Logger.setLevel(level);
      assert.equal(level, Logger.getLevel());

      Logger.setLevel('truce');
      assert.equal(level, Logger.getLevel());
    });

    it('should create a new logger with .create', () => {
      const loggerName = 'my logger';
      const logger = Logger.create(loggerName);
      assert.equal(logger.name, loggerName);
      assert(logger instanceof Logger);
    });

    it('should have log level methods on logger object', () => {
      const logger = new Logger('a name');
      const levels = Logger.allLevels();
      assert.equal(levels.length, 6);
      levels.forEach((level) => {
        assert.equal(typeof logger[level], 'function');
      });
    });

    it('should respect the log level', () => {
      Logger.setLevel('security');
      const logger = new Logger('name');
      assert.equal(logger.trace(''), false);
      assert.equal(logger.security(''), true);
    });
  });

  describe('Log Messages', () => {

    it('should log a complex string of params', (done) => {
      const msg = 'my message';
      const myArray = [1, 2, 3, 4, 5];
      const undef = undefined;
      const myObj = {one: 1, two: 'two'};
      const falsey = false;

      function debugStub() {
        return (logObj) => {
          assert.equal(logObj.msg, msg);
          assert.deepEqual(logObj.myArray, myArray);
          assert.deepEqual(logObj.myObj, myObj);
          assert.equal(logObj[0], undefined);
          assert.equal(logObj[1], false);
          done();
        };
      }
      const Logger = proxyquire('../../../lib/logging/logger', {
        debug: debugStub
      });

      Logger.setLevel('trace');
      const logger = new Logger('name');

      logger.trace(msg, {myArray}, {myObj}, undef, falsey);
    });
  });

});
