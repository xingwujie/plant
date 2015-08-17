
var debug = require('debug')('plant:index');
var request = require('request');

var ncdcToken = process.env.NCDC_TOKEN;

var req = {
  url: 'http://www.ncdc.noaa.gov/cdo-web/api/v2/datasets',
  headers: {
    token: ncdcToken
  }
}

request.get(req, function(error, response, body){
  if(error) {
    debug('Error:', error);
    return;
  }

  if(response.statusCode != 200) {
    debug('statusCode:', response.statusCode);
  }
  var result = JSON.parse(body);
  debug(result);
})
