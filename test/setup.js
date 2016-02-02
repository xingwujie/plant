require('node-version-checker');
process.env.PLANT_DB_NAME = 'plant-automated-testing';

process.env.PLANT_FB_ID = '<fake-fb-id>';
process.env.PLANT_FB_SECRET = '<fake-fb-secret>';
process.env.PLANT_FB_CALLBACK_URL = '/auth/facebook/callback';

if(!process.env.PLANT_DB_ACCOUNT) {
  console.log('No PLANT_DB_ACCOUNT ENV');
  process.exit(1);
};
