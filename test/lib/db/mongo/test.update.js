import * as utils from '../../../../app/libs/utils';
import assert from 'assert';
import async from 'async';
import mongo from '../../../../lib/db/mongo';

// const logger = require('../../../../lib/logging/logger').create('test:mongo-update');

describe('/lib/db/mongo/update', function() {
  this.timeout(10000);

  describe('note', () => {
    it('should update the image sizes in a note', (done) => {
      const note = {
        userId: utils.makeMongoId(),
        images: [{
          id: utils.makeMongoId(),
          ext: 'jpg',
          originalname: 'flower',
          size: 999
        }, {
          id: utils.makeMongoId(),
          ext: 'jpg',
          originalname: 'leaf',
          size: 666
        }]
      };
      const sizes = [
        {width:100, name:'thumb'},
        {width:500, name:'sm'},
        {width:1000, name:'md'},
        {width:1500, name:'lg'},
        {width:2000, name:'xl'}
      ];

      function createNote(data, cb) {
        mongo.upsertNote(note, (err, body) => {
          assert(!err);
          assert(body);
          // logger.trace('body', {body});
          data.createdNote = body;
          cb(err, data);
        });
      }

      function addSizesToNoteImage(data, cb) {
        const noteUpdate = {
          _id: data.createdNote._id,
          userId: note.userId,
          imageId: note.images[0].id,
          sizes
        };
        mongo.addSizesToNoteImage(noteUpdate, (err) => {
          assert(!err);
        });

        cb(null, data);
      }

      function getNote(data, cb) {
        mongo.getNoteById(data.createdNote._id, (err, fetchedNote) => {
          assert(!err);
          assert.deepEqual(fetchedNote.images[0].sizes, sizes);
          assert(!fetchedNote.images[1].sizes);
          cb(err, data);
        });
      }

      async.waterfall([
        createNote.bind(null, {}),
        addSizesToNoteImage,
        getNote
      ], (err, data) => {
        assert(!err);
        assert(data);
        done();
      });
    });


  });
});
