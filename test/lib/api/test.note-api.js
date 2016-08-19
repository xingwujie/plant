import * as helper from '../../helper';
import assert from 'assert';
import constants from '../../../app/libs/constants';

import d from 'debug';
const debug = d('plant:test.note-api');

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
    const howMany = 1;
    helper.createPlants(howMany, userId, (err, plants) => {
      initialPlant = plants[0];
      plantId = initialPlant._id;
      initialNote.plantIds = [plantId];
      debug('plant created:', initialPlant);
      done();
    });
  });

  describe('create failures', () => {
    it('should fail to create a note if user is not authenticated', (done) => {
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
        assert.equal(response.error, 'Not Authenticated');

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
        assert.equal(response.note[0], 'Note can\'t be blank');

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
        // response should look like:
        // { plantIds: [ 'Plant ids must be an array' ], note: [ 'Note can\'t be blank' ] }
        assert(!error);
        assert.equal(httpMsg.statusCode, 400);
        assert(response);
        assert.equal(response.plantIds[0], 'Plant ids must have at least 1 on plant associated');

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

        assert(!error);
        assert.equal(httpMsg.statusCode, 200);
        assert(response);
        assert(response.note);
        assert(constants.mongoIdRE.test(response._id));

        noteId = response._id;
        debug('note created:', response);

        done();
      });
    });

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
        // title: 'Plant Title',
        // userId: '241ff27e28c7448fb22c4f6fb2580923'}
        debug('note retrieved:', response);
        assert(!error);
        assert.equal(httpMsg.statusCode, 200);
        assert(response);
        assert(response.userId);
        assert.equal(response._id, plantId);
        assert.equal(response.title, initialPlant.title);
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
        // { ok: 1, nModified: 1, n: 1 }
        assert(!error);
        assert.equal(httpMsg.statusCode, 200);
        assert(response);
        assert.equal(response.ok, 1);
        assert.equal(response.n, 1);

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
        // response should look like:
        // { lastErrorObject: { n: 1 },
        // value:
        // { _id: 'c3478867852c47529ddcc498',
        //   note: 'A New Note',
        //   date: '2016-08-12T23:49:12.244Z',
        //   plantIds: [ '78d0570bc9104b0ca4cc29c2' ],
        //   userId: 'f5d12193ae674e7ab6d1e106' },
        // ok: 1 }

        assert(!error);
        assert.equal(httpMsg.statusCode, 200);
        assert(response);
        assert.equal(response.success, true);

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


        // Check that there are no notes
        assert.equal(response.notes.length, 0);

        done();
      });
    });
  });

});
