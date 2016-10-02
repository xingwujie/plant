// import moment from 'moment';
import validatejs from 'validate.js';
import note from './note';
import plant from './plant';
// const utils = require('../libs/utils');

//  The validator receives the following arguments:
//     value - The value exactly how it looks in the attribute object.
//     options - The options for the validator. Guaranteed to not be null or undefined.
//     key - The attribute name.
//     attributes - The entire attributes object.
//     globalOptions - The options passed when calling validate (will always be an object, non null).
//
// If the validator passes simply return null or undefined. Otherwise return a string or an array of strings containing the error message(s).
// Make sure not to append the key name, this will be done automatically.


// Validate an integeter date. Should be in the range of
// something like 17000101 to 20201231. Not sure why we'd
// have dates beyond the current day...
validatejs.validators.intDateValidate = (value, options) => {
  console.log('validatejs.intDateValidate options:', options);
  if(!value && !options.presence) {
    return;
  }

  if(typeof value !== 'number') {
    return 'must be a number';
  }

  // Don't allow dates before 1 Jan 1700
  if(value < 17000101) {
    return 'must be after 1st Jan 1700';
  }

  if(value.toString().length !== 8) {
    return 'must be in format YYYYMMDD';
  }

  const year = Math.round(value / 10000);
  if(year < 1700) {
    return `must have a valid year, year found was ${year}`;
  }

  const month = Math.round(value / 100) - year * 100;
  if(month < 1 || month > 12) {
    return `must have a valid month, value found was ${month}`;
  }

  const dayOfMonth = Math.round(value) - (year * 10000 + month * 100);
  if(dayOfMonth < 1 || dayOfMonth > 31) {
    return `must have a valid day-of-month, value found was ${dayOfMonth}`;
  }

};

export default {
  note, plant
};
