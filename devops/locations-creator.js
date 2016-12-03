// One off for converting / creating the location collection
// and updating the user and plant collections.

const mongo = require('../lib/db/mongo');
const async = require('async');

mongo._getAllUsersOnly((allUserErr, usersWithPlantIds) => {
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
    mongo.createLocation(loc, (createLocationErr, createdLocation) => {
      if(createLocationErr) {
        console.log('createLocationErr', createLocationErr);
        return cb(createLocationErr);
      } else {
        if(user.loc) {
          delete user.loc;
          mongo.updateUser(user, (updateUserErr) => {
            if(updateUserErr) {
              console.log('updateUserErr', updateUserErr);
            } else {
              mongo._setLocation(user._id, createdLocation._id, cb);
            }
          });
        } else {
          mongo._setLocation(user._id, createdLocation._id, cb);
        }
      }
    });
  }, (asyncEachUserErr) => {
    if(asyncEachUserErr) {
      console.log('asyncEachUserErr', asyncEachUserErr);
      return;
    } else {
      console.log('All complete');
    }
  });

});
