require('node-version-checker');
process.env.PLANT_DB_NAME = 'plant-automated-testing';

if(!process.env.PLANT_DB_ACCOUNT) {
  console.log('No PLANT_DB_ACCOUNT ENV');
  process.exit(1);
};
