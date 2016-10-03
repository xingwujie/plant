const _ = require('lodash');
const mongo = require('../lib/db/mongo');
const async = require('async');
const utils = require('../app/libs/utils');

function changeAllPlants(cb) {
  mongo.getAllCollection('plant', (err, data) => {
    console.log('Total plants:', data.length);
    let counter = 0;
    async.each(data, (value, done) => {
      if(_.isDate(value.purchasedDate) || _.isDate(value.plantedDate)) {
        if(_.isDate(value.purchasedDate)) {
          value.purchasedDate = utils.dateToInt(value.purchasedDate);
        }
        if(_.isDate(value.plantedDate)) {
          value.plantedDate = utils.dateToInt(value.plantedDate);
        }
        mongo.updatePlant(value, done);
        counter++;
      } else {
        done();
      }
    }, asyncErr => {
      console.log('changeAllPlants done', asyncErr, counter);
      cb(asyncErr);
    });
  });
}

function changeAllNotes(cb) {
  mongo.getAllCollection('note', (err, data) => {
    console.log('Total notes:', data.length);
    let counter = 0;
    async.each(data, (value, done) => {
      if(_.isDate(value.date)) {
        value.date = utils.dateToInt(value.date);
        mongo.updateNote(value, done);
        counter++;
      } else {
        done();
      }
    }, asyncErr => {
      console.log('changeAllNotes done', asyncErr, counter);
      cb(asyncErr);
    });
  });
}

async.parallel([
  changeAllPlants,
  changeAllNotes
], (err) => {
  console.log('All Done:', err);
});
