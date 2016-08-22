import moment from 'moment';
import validatejs from 'validate.js';
import note from './note';
import plant from './plant';

// Before using it we must add the parse and format functions
// Here is a sample implementation using moment.js
validatejs.extend(validatejs.validators.datetime, {
  // The value is guaranteed not to be null or undefined but otherwise it
  // could be anything.
  parse: function(value /*, options */ ) {
    if(value && typeof value === 'string' && /[\/]/g.test(value)) {
      const parts = value.split('/');
      if(parts.length !== 3) {
        return NaN;
      }
      if(parts[2].length !== 4) {
        return NaN;
      }
    }
    // debug('date parse:', value, options);
    const unixTimeStamp = +moment.utc(new Date(value));
    // debug('unixTimeStamp:', unixTimeStamp);
    return unixTimeStamp;
  },
  // Input is a unix timestamp
  format: function(value, options) {
    // debug('date format:', value, options);
    var format = options.dateOnly ? 'YYYY-MM-DD' : 'YYYY-MM-DD hh:mm:ss';
    return moment.utc(value).format(format);
  }
});

export default {
  note, plant
};
