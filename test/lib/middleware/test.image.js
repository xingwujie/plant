const assert = require('assert');
const image = require('../../../lib/middleware/image');


describe('image', () => {

  it('should calculdate the cut image sizes', () => {
    let actual = image.calcSizes(300);
    assert.deepEqual(actual, [300, false, false, false]);

    actual = image.calcSizes(499);
    assert.deepEqual(actual, [499, false, false, false]);

    actual = image.calcSizes(500);
    assert.deepEqual(actual, [500, false, false, false]);

    actual = image.calcSizes(501);
    assert.deepEqual(actual, [500, 501, false, false]);

    actual = image.calcSizes(750);
    assert.deepEqual(actual, [500, 750, false, false]);

    actual = image.calcSizes(1000);
    assert.deepEqual(actual, [500, 1000, false, false]);

    actual = image.calcSizes(1001);
    assert.deepEqual(actual, [500, 1000, 1001, false]);

    actual = image.calcSizes(1250);
    assert.deepEqual(actual, [500, 1000, 1250, false]);

    actual = image.calcSizes(1500);
    assert.deepEqual(actual, [500, 1000, 1500, false]);

    actual = image.calcSizes(1501);
    assert.deepEqual(actual, [500, 1000, 1500, 1501]);

    actual = image.calcSizes(1750);
    assert.deepEqual(actual, [500, 1000, 1500, 1750]);

    actual = image.calcSizes(1999);
    assert.deepEqual(actual, [500, 1000, 1500, 1999]);

    actual = image.calcSizes(2000);
    assert.deepEqual(actual, [500, 1000, 1500, 2000]);

    actual = image.calcSizes(2001);
    assert.deepEqual(actual, [500, 1000, 1500, 2000]);

    actual = image.calcSizes(3000);
    assert.deepEqual(actual, [500, 1000, 1500, 2000]);
  });

});
