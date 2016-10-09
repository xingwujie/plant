const slug = require('slug');
const isDate = require('lodash/isDate');
const moment = require('moment');

// bson is currently not being explicitly installed in the project because
// mongodb depends on mongodb-core which depends on bson. The Npm 3 installer
// will therefore install bson as a top level dependency in node_modules. If
// this pattern is changed then we would need to install npm independently.
// Requiring only bson here achieves 2 things:
// 1. Fixes a problem that Webpack has when bundling this module and chaining
//    from mongodb down to bson and,
// 2. Reduces the size of the bundle that gets generated for the browser.
const bson = require('bson');
const {ObjectID} = bson;

function makeMongoId() {
  return new ObjectID().toString();
}

function makeSlug(text) {
  if(!text) {
    console.warn('text is falsey in makeSlug:', text);
    return '';
  }

  text = text.toString();
  text = text.replace(/\//g, ' ');
  return slug(text.toString(), {
    // replacement: '-',
    // symbols: true,
    // remove: /[.]/g,
    lower: true,
    // charmap: slug.charmap,
    // multicharmap: slug.multicharmap
  });
}

function makePlantsUrl(user) {
  const userName = user.get('name');
  const _id = user.get('_id');

  return `/plants/${makeSlug(userName)}/${_id}`;
}

/**
 * Convert a date like object to an Integer
 * @param {object} date - could be object, string or Integer
 * @returns {Integer} - a date in the form YYYYMMDD
 */
function dateToInt(date) {
  if(moment.isMoment(date)) {
    return dateToInt(date.toDate());
  } else if(isDate(date)) {
    return date.getFullYear() * 10000 +
      (date.getMonth() + 1) * 100 +
      date.getDate();
  } else if (typeof date === 'string') {
    return dateToInt(new Date(date));
  } else if (typeof date === 'number') {
    return date;
  } else {
    console.error('Unable to convert in dateToInt:', date);
    throw new Error(`dateToInt(${date})`);
  }
}

function intToDate(date) {
  const year = Math.round(date / 10000);
  const month = Math.round( (date - year * 10000) / 100);
  const day = Math.round( (date - (year * 10000 + month * 100)));
  return new Date(year, month - 1, day);
}

function intToMoment(date) {
  return moment(intToDate(date));
}

function intToString(date) {
  return intToMoment(date).format('MM/DD/YYYY');
}

/**
 * Filters the plantIds array based on filter
 * @param {array} plantIds - original plantIds to filter
 * @param {Immutable.Map} plants - all the plants available to sort
 * @param {string} filter - optional text to filter title of plant
 * @returns {array} - an array of filtered plantIds
 */
function filterPlants(plantIds, plants, filter) {
  return filter
    ? plantIds.filter(plantId => {
      const plant = plants.get(plantId);
      return !plant || (plant.get('title') || '').toLowerCase().indexOf(filter) >= 0;
    })
    : plantIds;
}

/**
 * Sorts the plantIds based on the plant's title
 * @param {array} plantIds - original plantIds to filter
 * @param {Immutable.Map} plants - all the plants available to sort
 * @returns {array} - an array of sorted plantIds
 */
function sortPlants(plantIds, plants) {
  return plantIds.sort((a, b) => {
    const plantA = plants.get(a);
    const plantB = plants.get(b);
    if(plantA && plantB) {
      if(plantA.get('title') === plantB.get('title')) {
        return 0;
      }
      return plantA.get('title') > plantB.get('title') ? 1 : -1;
    } else {
      return 0;
    }
  });
}

/**
 * Filters the plantIds array and sorts based on the plant's title
 * @param {array} plantIds - original plantIds to filter
 * @param {Immutable.Map} plants - all the plants available to sort
 * @param {string} filter - optional text to filter title of plant
 * @returns {array} - an array of sorted and filtered plantIds
 */
function filterSortPlants(plantIds, plants, filter) {
  const filteredPlantIds = filterPlants(plantIds, plants, filter);

  return sortPlants(filteredPlantIds, plants);
}

module.exports = {
  dateToInt,
  filterPlants,
  filterSortPlants,
  intToDate,
  intToMoment,
  intToString,
  makeMongoId,
  makePlantsUrl,
  makeSlug,
  sortPlants
};

// TODO: Move this file to a /shared/ folder.
