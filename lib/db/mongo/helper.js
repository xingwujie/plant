const ObjectID = require('mongodb').ObjectID;

function fixStringId(obj) {
  if(obj && obj._id && typeof obj._id === 'string') {
    obj._id = new ObjectID(obj._id);
  }
  return obj;
};

module.exports = {
  fixStringId
};
