// One off for converting / creating the location collection
// and updating the user and plant collections.

const mongo = require('../lib/db/mongo');
const async = require('async');

mongo.getAllUsers((allUserErr, usersWithPlantIds) => {
  if(allUserErr) {
    console.log('allUserErr', allUserErr);
    return;
  }

  async.each(usersWithPlantIds, (user, cb) => {
    const loc = {
      userId: user._id,
      ownerIds: [user._id],
      title: `${user.name} Yard`
    };
    if(user.loc) {
      loc.loc = user.loc;
    }
    mongo.createLocation(loc, (createLocationErr) => {
      if(createLocationErr) {
        return cb(createLocationErr);
      } else {
        if(user.loc) {
          // TODO: Create an update for user
          // mongo.updateUser
        } else {
          cb();
        }
      }
    });
  }, (asyncEachUserErr) => {
    if(asyncEachUserErr) {
      console.log('asyncEachUserErr', asyncEachUserErr);
      return;
    }
  });

});
