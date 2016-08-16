import * as helper from '../../helper';
import assert from 'assert';
import async from 'async';
import mongo from '../../../lib/db/mongo';
import * as utils from '../../../app/libs/utils';

import d from 'debug';
const debug = d('plant:test.plant-api-delete');

describe('plant-api-delete', function() {
  this.timeout(10000);
  let userId;

  before('it should start the server and setup auth token', done => {
    helper.startServerAuthenticated((err, data) => {
      assert(data.userId);
      userId = data.userId;
      done();
    });
  });

  describe('simple plant deletion', () => {
    it('should delete a plant without notes', done => {
      helper.createPlants(1, userId, (err, plants) => {
        assert(!err);
        const reqOptions = {
          method: 'DELETE',
          authenticate: true,
          json: true,
          url: `/api/plant/${plants[0]._id}`
        };

        helper.makeRequest(reqOptions, (error, httpMsg, response) => {
          assert(!error);
          debug('response:', response);
          assert.equal(httpMsg.statusCode, 200);
          assert.deepStrictEqual(response, {message: 'Deleted'});
          done();
        });
      });

    });

    it('should return a 404 if plant id does not exist', done => {
      const reqOptions = {
        method: 'DELETE',
        authenticate: true,
        json: true,
        url: `/api/plant/${utils.makeMongoId()}`
      };

      helper.makeRequest(reqOptions, (error, httpMsg, response) => {
        debug('DELETE /api/plant response:', response);
        assert(!error);
        assert.equal(httpMsg.statusCode, 404);
        assert.equal(response.message, 'Not Found');
        done();
      });

    });

  });

  describe('plant/note deletion', () => {
    it('should delete notes when a plant is deleted', done => {
      // 1. Create 2 plants
      // 2. Create 3 notes:
      //    Note #1: plantIds reference plant #1
      //    Note #2: plantIds reference plant #1 & #2
      //    Note #3: plantIds reference plant #2
      // 3. Delete plant #1
      // 4. Confirm that Note #1 is no longer in DB
      // 5. Retrieve plant #2 and confirm that both notes are attached.

      async.waterfall([

        // 1. Create 2 plants
        async.apply(helper.createPlants, 2, userId),

        // 2. Create 3 notes, part 1.1:
        //    Note #1: plantIds reference plant #1
        (plants, cb) => {
          assert(plants.length, 2);
          helper.createNote([plants[0]._id], {note: 'Note #1'}, (err, note) => {
            assert(note);
            cb(err, plants, [note]);
          });
        },

        // 2. Create 3 notes, part 1.2:
        //    Update Note #1 so that it's on revision 2-...
        (plants, notes, cb) => {
          const updatedNote = {...notes[0], x: 'random'};
          mongo.updateNote(updatedNote, (err, note) => {
            assert(!err);
            assert(note);
            cb(err, plants, notes);
          });
        },

        // 2. Create 3 notes, part 2:
        //    Note #2: plantIds reference plant #1 & #2
        (plants, notes, cb) => {
          helper.createNote([plants[0]._id, plants[1]._id], {note: 'Note #2'}, (err, note) => {
            assert(note);
            notes.push(note);
            cb(err, plants, notes);
          });
        },

        // 2. Create 3 notes, part 3:
        //    Note #3: plantIds reference plant #2
        (plants, notes, cb) => {
          helper.createNote([plants[1]._id], {note: 'Note #3'}, (err, note) => {
            assert(note);
            notes.push(note);
            cb(err, plants, notes);
          });
        },

        // 3. Delete plant #1
        (plants, notes, cb) => {

          const reqOptions = {
            method: 'DELETE',
            authenticate: true,
            json: true,
            url: `/api/plant/${plants[0]._id}`
          };
          debug('#3.1');
          helper.makeRequest(reqOptions, (error, httpMsg, response) => {
            debug('#3.2');
            assert(!error);
            assert.equal(httpMsg.statusCode, 200);

            assert.deepStrictEqual(response, {message: 'Deleted'});
            cb(error, plants, notes);
          });
          debug('#3.3');

        },

        // 4. Confirm that Note #1 is no longer in DB
        (plants, notes, cb) => {
          mongo.getNoteById(notes[0]._id, (err, result) => {

            assert(!err);
            debug('result:', result);
            assert(!result);
            cb(null, plants, notes);
          });
        },

        // 5. Retrieve plant #2 and confirm that both notes are attached.
        (plants, notes, cb) => {
          debug('notes:', notes);
          const reqOptions = {
            method: 'GET',
            authenticate: true,
            json: true,
            url: `/api/plant/${plants[1]._id}`
          };

          helper.makeRequest(reqOptions, (error, httpMsg, plant) => {
            assert(!error);
            assert.equal(httpMsg.statusCode, 200);
            assert(plant);
            assert.equal(plant._id, plants[1]._id);
            assert.equal(plant.notes.length, 2);

            // The notes array could be in any order.
            // TODO: Should sort in date order in DB
            debug('plant.notes:', plant.notes);
            const noteIds = [notes[1]._id, notes[2]._id];
            debug('noteIds:', noteIds);
            assert(noteIds.indexOf(plant.notes[0]._id) >= 0);
            assert(noteIds.indexOf(plant.notes[1]._id) >= 0);

            cb(error, plants, notes);
          });
        },
      ],

      // Final callback
      (err, plants, notes) => {
        assert(!err);
        assert.equal(plants.length, 2);
        assert.equal(notes.length, 3);
        done();
      });

    });

  });

});
