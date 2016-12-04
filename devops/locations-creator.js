// One off for converting / creating the location collection
// and updating the user and plant collections.

const mongo = require('../lib/db/mongo');
const async = require('async');

const Logger = require('../lib/logging/logger');
Logger.setLevel('trace');
const logger = new Logger('devops-location-creator');

mongo._getAllUsersOnly((allUserErr, usersWithPlantIds) => {
  if(allUserErr) {
    logger.trace('allUserErr', {allUserErr});
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
        logger.trace('createLocationErr', {createLocationErr});
        return cb(createLocationErr);
      } else {
        if(user.loc) {
          delete user.loc;
          mongo._updateUser(user, (updateUserErr) => {
            if(updateUserErr) {
              logger.trace('updateUserErr', {updateUserErr});
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
      logger.trace('asyncEachUserErr', {asyncEachUserErr});
    } else {
      logger.trace('All complete');
    }
    logger.trace('Closing...');
    mongo._close();
  });

});
