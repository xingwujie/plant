# Weather Functionality

This module needs to be able to get local weather history.

A function in this module would typically be called something like this:

```javascript
const weather = require('weather');

weather.get({
  long: 15,
  lat: 15,
  start: Date(2015, 1, 1),
  end: Date(2015, 1, 1),
  rainfall: true,
  temperatures: true
}, (err, data) => {
  // data is an array of objects that have these properties:
  // 1. date
  // 2. high temperature
  // 3. low temperature
  // 4. rainfall
});
```
