import _ from 'lodash';
import * as helper from '../../helper';
import assert from 'assert';
import constants from '../../../app/libs/constants';

// import d from 'debug';
// const debug = d('plant:test.note-api');

describe('note-api', function() {
  this.timeout(10000);
  let userId;

  before('it should start the server and setup auth token', done => {
    helper.startServerAuthenticated((err, data) => {
      assert(data.userId);
      userId = data.userId;
      done();
    });
  });

  let initialPlant;
  let plantId;

  const initialNote = {
    note: 'This is a note',
    date: new Date()
  };
  let noteId;

  before('it should create a plant', (done) => {
    helper.createPlants(1, userId, (err, plants) => {
      initialPlant = plants[0];
      plantId = initialPlant._id;
      initialNote.plantIds = [plantId];
      done();
    });
  });

  describe('note-api create failures', () => {
    it('should fail to create a note document if user is not authenticated', (done) => {
      const reqOptions = {
        method: 'POST',
        authenticate: false,
        body: initialNote,
        json: true,
        url: '/api/note'
      };
      helper.makeRequest(reqOptions, (error, httpMsg, response) => {
        // debug(response);
        // debug('httpMsg.statusCode:', httpMsg.statusCode);

        assert(!error);
        assert.equal(httpMsg.statusCode, 401);
        assert(response);
        assert.equal(response.error, `Not Authenticated`);

        done();
      });
    });

    it('should fail server validation if note is missing', (done) => {
      const reqOptions = {
        method: 'POST',
        authenticate: true,
        body: {...initialNote, note: ''},
        json: true,
        url: '/api/note'
      };
      helper.makeRequest(reqOptions, (error, httpMsg, response) => {
        // debug(response);
        // response should look like:
        // { plantIds: [ 'Plant ids must be an array' ], note: [ 'Note can\'t be blank' ] }
        assert(!error);
        assert.equal(httpMsg.statusCode, 400);
        assert(response);
        assert.equal(response.note[0], `Note can't be blank`);

        done();
      });
    });

    it('should fail server validation if plantIds are missing', (done) => {
      const reqOptions = {
        method: 'POST',
        authenticate: true,
        body: {...initialNote, plantIds: []},
        json: true,
        url: '/api/note'
      };
      helper.makeRequest(reqOptions, (error, httpMsg, response) => {
        // debug(response);
        // response should look like:
        // { plantIds: [ 'Plant ids must be an array' ], note: [ 'Note can\'t be blank' ] }
        assert(!error);
        assert.equal(httpMsg.statusCode, 400);
        assert(response);
        assert.equal(response.plantIds[0], `Plant ids must have at least 1 on plant associated`);

        done();
      });
    });

  });

  describe('note-api create/retrieve notes', () => {

    it('should create a note', (done) => {
      const reqOptions = {
        method: 'POST',
        authenticate: true,
        body: initialNote,
        json: true,
        url: '/api/note'
      };
      helper.makeRequest(reqOptions, (error, httpMsg, response) => {
        // debug(response);
        // response should look like:
        // { ok: true,
        // id: '500147d5b68746efa2cc18510d4663a6',
        // rev: '1-bbeb5b8c4a14d2ff9008a4c818443bf7' }
        assert(!error);
        assert.equal(httpMsg.statusCode, 200);
        assert(response);
        assert(response.ok);
        assert(constants.uuidRE.test(response.id));
        assert(_.startsWith(response.rev, '1-'));

        noteId = response.id;

        done();
      });
    });

    // TODO: Convert the tests from here onwards to note tests (copied from plant)

    it('should retrieve the just created note as part of the plant', (done) => {
      const reqOptions = {
        method: 'GET',
        authenticate: false,
        json: true,
        url: `/api/plant/${plantId}`
      };
      helper.makeRequest(reqOptions, (error, httpMsg, response) => {
        // response should look like:
        // { _id: 'e5fc6fff0a8f48ad90636b3cea6e4f93',
        // _rev: '1-fecae45e9dfdde023b93ebe313ff6ce1',
        // title: 'Plant Title',
        // userId: '241ff27e28c7448fb22c4f6fb2580923',
        // type: 'plant' }
        assert(!error);
        assert.equal(httpMsg.statusCode, 200);
        assert(response);
        // TODO: Will the client ever need the _rev?
        // If not we should strip out at source.
        assert(response.userId);
        assert.equal(response._id, plantId);
        assert.equal(response.title, initialPlant.title);
        assert.equal(response.type, 'plant');
        assert(response.notes);
        assert.equal(response.notes.length, 1);
        assert.equal(response.notes[0]._id, noteId);

        done();
      });
    });

    let updatedNote;
    it('should update the just created note', (done) => {
      updatedNote = {
        ...initialNote,
        note: 'A New Note',
        _id: noteId
      };

      const reqOptions = {
        method: 'PUT',
        authenticate: true,
        body: updatedNote,
        json: true,
        url: '/api/note'
      };

      helper.makeRequest(reqOptions, (error, httpMsg, response) => {
        // response should look like:
        // { ok: true,
        // id: 'ff3c5edea01a46b19c3d6af759bcda95',
        // rev: '2-57363e3a510dc13b26e53afccf80294c' }
        assert(!error);
        assert.equal(httpMsg.statusCode, 200);
        assert(response);
        assert(response.ok);
        assert.equal(response.id, noteId);
        // Should now be on revision #2
        assert(_.startsWith(response.rev, '2-'));

        done();
      });
    });

    it('should retrieve the just updated note as part of a plant request', (done) => {
      const reqOptions = {
        method: 'GET',
        authenticate: false,
        json: true,
        url: `/api/plant/${plantId}`
      };

      helper.makeRequest(reqOptions, (error, httpMsg, response) => {

        assert(!error);
        assert.equal(httpMsg.statusCode, 200);
        assert(response);

        assert(response.userId);
        assert.equal(response._id, plantId);
        assert.equal(response.title, initialPlant.title);
        assert.equal(response.type, 'plant');

        // Check notes
        assert(response.notes);
        assert.equal(response.notes.length, 1);
        assert.equal(response.notes[0]._id, noteId);
        assert.equal(response.notes[0].note, updatedNote.note);

        done();
      });
    });

    it('should delete the note', (done) => {

      const reqOptions = {
        method: 'DELETE',
        authenticate: true,
        json: true,
        url: `/api/note/${noteId}`
      };

      helper.makeRequest(reqOptions, (error, httpMsg, response) => {
        // debug('response:', response);
        // response should look like:
        // { ok: true,
        // id: '386613f402b2407bb4781d31133886c3',
        // rev: '3-8fa47a7f50265ad19f036f406b888a0b' }
        assert(!error);
        assert.equal(httpMsg.statusCode, 200);
        assert(response);
        assert(response.ok);
        assert.equal(response.id, noteId);

        done();
      });
    });

    it('should confirm that the note has been deleted', (done) => {
      const reqOptions = {
        method: 'GET',
        authenticate: false,
        json: true,
        url: `/api/plant/${plantId}`
      };

      helper.makeRequest(reqOptions, (error, httpMsg, response) => {

        assert(!error);
        assert.equal(httpMsg.statusCode, 200);
        assert(response);

        assert(response.userId);
        assert.equal(response._id, plantId);
        assert.equal(response.title, initialPlant.title);
        assert.equal(response.type, 'plant');

        // Check that there are no notes
        assert.equal(response.notes.length, 0);

        done();
      });
    });
  });

});
