require('node-version-checker');
var jsdom = require('jsdom');

process.env.PLANT_DB_NAME = 'plant-automated-testing';

process.env.PLANT_FB_ID = '<fake-fb-id>';
process.env.PLANT_FB_SECRET = '<fake-fb-secret>';
process.env.PLANT_FB_CALLBACK_URL = '/auth/facebook/callback';
process.env.PLANT_TOKEN_SECRET = '<fake-token-secret>';

// The test can connect to Cloudant as the DB or a locally running
// instance of CouchDB.

// If running locally then we should have Docker running a local
// instance of CouchDB:
// docker pull klaemo/couchdb:latest
// docker run -d -p 5984:5984 --name couchdb klaemo/couchdb
// Test: curl http://localhost:5984

// To run locally against Cloudant then:
// Comment the next block and uncomment the subsequent block

if(!process.env.TRAVIS) {
  process.env.PLANT_DB_URL = 'http://localhost:5984';
};

// if(!process.env.PLANT_DB_ACCOUNT) {
//   console.log('No PLANT_DB_ACCOUNT ENV');
//   process.exit(1);
// };


// from mocha-jsdom https://github.com/rstacruz/mocha-jsdom/blob/master/index.js#L80
function propagateToGlobal (win) {
  for (var key in win) {
    if (!win.hasOwnProperty(key)) {
      continue;
    }
    if (key in global) {
      continue;
    }

    global[key] = win[key];
  }
}


// Source: https://github.com/jesstelford/react-testing-mocha-jsdom
// A super simple DOM ready for React to render into
// Store this DOM and the window in global scope ready for React to access
global.document = jsdom.jsdom('<!doctype html><html><body></body></html>');
// global.window = document.parentWindow;
global.window = document.defaultView;
// global.navigator = {userAgent: 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2454.85 Safari/537.36'};
global.navigator = global.window.navigator;
propagateToGlobal(global.window);
