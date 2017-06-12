
const request = require('request');

const ncdcToken = process.env.NCDC_TOKEN;

const req = {
  url: 'http://www.ncdc.noaa.gov/cdo-web/api/v2/datasets',
  headers: {
    token: ncdcToken,
  },
};

request.get(req, (error, response /* , body */) => {
  if (error) {
    return;
  }

  if (response.statusCode !== 200) {
  }
  try {
    // const result = JSON.parse(body);
  } catch (e) {

  }
});
