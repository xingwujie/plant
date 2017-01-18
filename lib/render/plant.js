const indexHtml = require('.');

module.exports = (req, res) => {
  res.send(indexHtml());
};
