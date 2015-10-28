// Validates that the input string is a valid date formatted as "mm/dd/yyyy"
export default function (dateString) {
  // First check for the pattern
  if(!/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateString)) {
    return 'Date must be in MM/DD/YYYY format.';
  }

  // Parse the date parts to integers
  const parts = dateString.split('/');
  const day = parseInt(parts[1], 10);
  const month = parseInt(parts[0], 10);
  const year = parseInt(parts[2], 10);

  // Check the ranges of month and year
  if(year < 1900 || year > 2030) {
    return `Year range 1900 to 2030 allowed: ${year}`;
  }

  if(month < 1 || month > 12) {
    return `Invalid month: ${month}`;
  }

  var monthLength = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];

  // Adjust for leap years
  if(year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0)) {
    monthLength[1] = 29;
  }

  // Check the range of the day
  if(day < 1 || day > monthLength[month - 1]) {
    return `Invalid day of month: ${day}`;
  }

  return '';
};
