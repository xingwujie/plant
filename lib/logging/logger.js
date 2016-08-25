const _ = require('lodash');
const debug = require('debug');
const loggly = require('./loggly-wrapper')();

const levels = ['trace', 'info', 'warn', 'error', 'fatal', 'security'];

let currentLevelIndex = levels.indexOf('error');

class Logger {
  constructor(logName) {
    this.debug = debug(`plant:${logName}`);
    this.name = logName;
    levels.forEach((level, index) => {
      this[level] = this.write.bind(this, index);
    });
  }

  static create(logName) {
    return new Logger(logName);
  }

  static allLevels() {
    return levels;
  }

  static getLevel() {
    return levels[currentLevelIndex];
  }

  static setLevel(newLevelName) {
    const newLevelIndex = levels.indexOf(newLevelName);
    if(newLevelIndex >= 0) {
      currentLevelIndex = newLevelIndex;
    }
  }

  write(levelIndex, msg) {
    if(levelIndex >= currentLevelIndex) {
      const args = Array.from(arguments).slice(2);
      const logObject = {
        level: levels[levelIndex],
        msg
      };
      let counter = 0;

      args.forEach(arg => {
        if(_.isObject(arg) && !_.isArray(arg)) {
          Object.assign(logObject, arg);
        } else {
          logObject[counter++] = arg;
        }
      });

      loggly(logObject);
      this.debug(logObject);

      return true;
    } else {
      return false;
    }
  }

}

module.exports = Logger;
