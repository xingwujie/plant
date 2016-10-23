const constants = require('./constants');
const {gisMultiplier} = constants;

function scaleToCanvas(immutablePlants, width) {
  const minMax = immutablePlants.reduce((acc, plant) => {
    const long = plant.getIn(['loc', 'coordinates', '0']);
    const lat = plant.getIn(['loc', 'coordinates', '1']);
    if(isNaN(long) || isNaN(lat)) {
      console.warn(`NaN found in getting min/max of long/lat ${long} / ${lat}`);
    } else {
      acc.long.min = Math.min(acc.long.min, long);
      acc.long.max = Math.max(acc.long.max, long);
      acc.lat.min = Math.min(acc.lat.min, lat);
      acc.lat.max = Math.max(acc.lat.max, lat);
    }
    return acc;
  }, {long: {min:180, max:-180}, lat: {min: 90, max: -90}});

  minMax.long.min = Math.round(minMax.long.min * gisMultiplier);
  minMax.long.max = Math.round(minMax.long.max * gisMultiplier);
  minMax.lat.min = Math.round(minMax.lat.min * gisMultiplier);
  minMax.lat.max = Math.round(minMax.lat.max * gisMultiplier);

  // Take 10 pixels off each side.
  const canvasWidth = width - 20;
  const canvasMin = 10;
  const actualWidth = minMax.long.max - minMax.long.min;
  const actualHeight = minMax.lat.max - minMax.lat.min;
  const heightWidthRatio = actualHeight / actualWidth;
  const canvasHeight = heightWidthRatio * canvasWidth;

  const plants = immutablePlants.map(plant => {
    const long = Math.round(plant.getIn(['loc', 'coordinates', '0']) * gisMultiplier);
    const ratioFromMin = (long - minMax.long.min) / actualWidth;
    const x = (canvasWidth * ratioFromMin) + canvasMin;

    const lat = Math.round(plant.getIn(['loc', 'coordinates', '1']) * gisMultiplier);
    const ratioFromMinLat = (lat - minMax.lat.min) / actualHeight;
    const y = (heightWidthRatio * (canvasWidth * ratioFromMinLat) + canvasMin);

    const title = plant.getIn('title');
    return {title, x, y};
  });
  return {
    plants,
    canvasHeight
  };
}

module.exports = {
  scaleToCanvas,
};


