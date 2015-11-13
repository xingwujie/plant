import _ from 'lodash';
import isValidDate from './date-validation';

export function plantNote(note) {

  const errors = [];

  if(!note.date) {
    errors.push('Date must be entered.');
  } else {
    const dateErrText = isValidDate(note.date);
    if(!dateErrText) {
      errors.push(dateErrText);
    }
  }

  if(!note.description) {
    errors.push('Description must be entered.');
  }

  if(note.height) {
    const height = parseFloat(note.height);
    if(_.isNaN(height) || !_.isNumber(height)) {
      errors.push(`Unable to convert height: ${note.height}`);
    }
  }

  if(note.width) {
    const width = parseFloat(note.width);
    if(_.isNaN(width) || !_.isNumber(width)) {
      errors.push(`Unable to convert width: ${note.width}`);
    }
  }
}
