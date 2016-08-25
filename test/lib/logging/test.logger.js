// import _ from 'lodash';
const Logger = require('../../../lib/logging/logger');
// const assert = require('assert');

describe('Logger', function() {
  // this.timeout(10000);

  it('should log a message', () => {
    const logger = new Logger('test.logger');
    Logger.setLevel('trace');
    logger.trace('my message', {some: 'data'}, 'stuff', [1, 2, 3, 4]);
  });

});
