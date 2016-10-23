const gis = require('../../../app/libs/gis');
const assert = require('assert');
const Immutable = require('immutable');

describe('/app/libs/gis', function() {
  describe('scaling to canvas', () => {
    it('should scale zero plants', () => {
      const width = 700;
      const immutablePlants = Immutable.Map();
      const scaledPlants = gis.scaleToCanvas(immutablePlants, width);
      assert(Immutable.Map.isMap(scaledPlants.plants));
      assert.equal(scaledPlants.plants.size, 0);
      assert.equal(scaledPlants.canvasHeight, 0);
    });

    it('should scale a single plant', () => {
      const plants = {
        '1': {
          _id: '1',
          title: 'Title 1',
          loc: {
            coordinates: [10, 20]
          }
        }
      };
      const width = 700;
      const immutablePlants = Immutable.fromJS(plants);
      const scaledPlants = gis.scaleToCanvas(immutablePlants, width);
      assert(Immutable.Map.isMap(scaledPlants.plants));
      assert.equal(scaledPlants.plants.size, 1);
      assert.equal(scaledPlants.canvasHeight, width);
    });

    it('should scale two plants on the same latitude', () => {
      const plants = {
        '1': {
          _id: '1',
          title: 'Title 1',
          loc: {
            coordinates: [10, 20]
          }
        },
        '2': {
          _id: '2',
          title: 'Title 2',
          loc: {
            coordinates: [11, 20]
          }
        }
      };
      const width = 700;
      const immutablePlants = Immutable.fromJS(plants);
      const scaledPlants = gis.scaleToCanvas(immutablePlants, width);
      assert(Immutable.Map.isMap(scaledPlants.plants));
      assert.equal(scaledPlants.plants.size, 2);
      assert.equal(scaledPlants.canvasHeight, width);
    });

    it('should scale two plants on the same longitude', () => {
      const plants = {
        '1': {
          _id: '1',
          title: 'Title 1',
          loc: {
            coordinates: [10, 20]
          }
        },
        '2': {
          _id: '2',
          title: 'Title 2',
          loc: {
            coordinates: [10, 21]
          }
        }
      };
      const width = 700;
      const immutablePlants = Immutable.fromJS(plants);
      const scaledPlants = gis.scaleToCanvas(immutablePlants, width);
      assert(Immutable.Map.isMap(scaledPlants.plants));
      assert.equal(scaledPlants.plants.size, 2);
      assert.equal(scaledPlants.canvasHeight, width);
    });
  });
});
