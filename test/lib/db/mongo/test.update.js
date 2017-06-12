const utils = require('../../../../app/libs/utils');
const assert = require('assert');
const async = require('async');
const mongo = require('../../../../lib/db/mongo');

// const logger = require('../../../../lib/logging/logger').create('test:mongo-update');

describe('/lib/db/mongo/update', function describer() {
  this.timeout(10000);

  describe('note', () => {
    it('should update the image sizes in a note', (done) => {
      const note = {
        userId: utils.makeMongoId(),
        images: [{
          id: utils.makeMongoId(),
          ext: 'jpg',
          originalname: 'flower',
          size: 999,
        }, {
          id: utils.makeMongoId(),
          ext: 'jpg',
          originalname: 'leaf',
          size: 666,
        }],
      };
      const sizes = [
        { width: 100, name: 'thumb' },
        { width: 500, name: 'sm' },
        { width: 1000, name: 'md' },
        { width: 1500, name: 'lg' },
        { width: 2000, name: 'xl' },
      ];

      function createNote(data, cb) {
        mongo.upsertNote(note, (err, createdNote) => {
          assert(!err);
          assert(createdNote);

          cb(err, Object.assign({}, data, { createdNote }));
        });
      }

      function addSizesToNoteImage(data, cb) {
        const noteUpdate = {
          _id: data.createdNote._id,
          userId: note.userId,
          imageId: note.images[0].id,
          sizes,
        };
        mongo.addSizesToNoteImage(noteUpdate, (err) => {
          assert(!err);
          cb(err, data);
        });
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
        getNote,
      ], (err, data) => {
        assert(!err);
        assert(data);
        done();
      });
    });
  });
});
