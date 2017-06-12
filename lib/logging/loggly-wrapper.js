const loggly = require('loggly');

module.exports = () => {
  if (process.env.PLANT_LOGGLY_TOKEN) {
    const client = loggly.createClient({
      token: process.env.PLANT_LOGGLY_TOKEN,
      subdomain: process.env.PLANT_LOGGLY_SUBDOMAIN,
      auth: {
        username: process.env.PLANT_LOGGLY_USERNAME,
        password: process.env.PLANT_LOGGLY_PASSWORD,
      },
      // This is a comma separated list of tags used for filtering in reporting.
      tags: `plant-${process.env.NODE_ENV}`,
      // When the json flag is enabled, objects will be converted to JSON using
      // JSON.stringify before being transmitted to Loggly.
      json: true,
    });

    return (json) => {
      client.log(json, () => {});
    };
  }
  return () => {};
};
