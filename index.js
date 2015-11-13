require('babel-core/register');

var app = require('./lib/server');

console.log('typeof app:', typeof app);
console.log('app:', app);

app.default();
