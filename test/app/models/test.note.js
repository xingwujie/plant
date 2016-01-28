import _ from 'lodash';
import validators from '../../../app/models';
import constants from '../../../app/libs/constants';
import assert from 'assert';

const noteValidator = validators.note;

// import d from 'debug';
// const debug = d('plant:test.plant');

describe('/app/models/note', function() {

  it('should pass minimum validation', (done) => {
    const note = {
      _id: '0e55d91cb33d420024432d67a3c7fb36',
      date: new Date(),
      plantIds: ['9ec5c8ffcf885bf372488977ae0d6476'],
      note: 'some text',
      type: 'note',
      userId: '9ec5c8ffcf885bf372488977ae0d6476',
    };
    const noteCopy = _.clone(note);

    const isNew = false;

    noteValidator(note, {isNew}, (err, transformed) => {
      assert(!err);
      assert.equal(transformed.note, note.note);
      assert.deepEqual(noteCopy, note);
      done();
    });
  });

  it('should fail validation', (done) => {
    // All items in note should be invalid
    const note = {
      _id: '0e55d91cb33d42', // Not a UUID
      date: 'Note a Date',
      plantIds: ['9ec5c8ffcf885bf'], // Not a UUID in array
      note: {}, // not a string
      type: 'noter', // not 'note'
      userId: '9ec5c8ffcf88',  // Not a UUID
    };

    const noteCopy = _.clone(note);

    const isNew = false;

    noteValidator(note, {isNew}, (err /*, transformed*/) => {
      assert(err);
      // debug(err);

      assert.equal(err._id, ' id is invalid');
      assert.equal(err.date, 'Date must be a valid date');
      assert.equal(err.plantIds, 'Plant ids must be UUIDs');
      assert.equal(err.note, 'Note can\'t be blank');
      assert(!err.type);
      assert.equal(err.userId, 'User id is invalid');
      assert.deepEqual(noteCopy, note);
      done();
    });
  });

  it('should strip out props not in the schema', (done) => {
    const note = {
      _id: '0e55d91cb33d420024432d67a3c7fb36',
      date: new Date(),
      plantIds: ['9ec5c8ffcf885bf372488977ae0d6476'],
      note: 'some text',
      type: 'note',
      userId: '9ec5c8ffcf885bf372488977ae0d6476',
      fakeName1: 'Common Name',
      fakeName2: 'Description',
    };
    const noteCopy = _.clone(note);

    const isNew = false;

    noteValidator(note, {isNew}, (err, transformed) => {
      // debug('err:', err);
      // debug('transformed:', transformed);

      assert(!err);
      assert.equal(Object.keys(transformed).length, 6);
      assert.equal(transformed._id, note._id);
      assert.equal(transformed.note, note.note);
      assert.equal(transformed.type, 'note');
      assert.equal(transformed.userId, note.userId);
      assert(!transformed.fakeName1);
      assert(!transformed.fakeName2);
      assert.deepEqual(noteCopy, note);
      done();
    });
  });

  it('should add _id if it is a new record', (done) => {
    const note = {
      date: new Date(),
      plantIds: ['9ec5c8ffcf885bf372488977ae0d6476'],
      note: 'some text',
      type: 'note',
      userId: '9ec5c8ffcf885bf372488977ae0d6476',
    };
    const noteCopy = _.clone(note);

    const isNew = true;
    noteValidator(note, {isNew}, (err, transformed) => {

      assert(!err);
      assert.equal(Object.keys(transformed).length, 6);
      assert(transformed._id);
      assert(constants.uuidRE.test(transformed._id));
      assert.equal(transformed.note, note.note);
      assert.equal(transformed.type, 'note');
      assert.equal(transformed.userId, note.userId);
      assert.equal(transformed.plantIds, note.plantIds);
      assert.deepEqual(noteCopy, note);
      done();
    });
  });

  it('should fail if userId is missing', (done) => {
    const note = {
      _id: '0e55d91cb33d420024432d67a3c7fb36',
      date: new Date(),
      plantIds: ['9ec5c8ffcf885bf372488977ae0d6476'],
      note: 'some text',
      type: 'note',
    };
    const noteCopy = _.clone(note);

    const isNew = false;

    noteValidator(note, {isNew}, (err, transformed) => {
      // debug('err:', err);
      // debug('transformed:', transformed);

      assert(err);
      assert.equal(err.userId, `User id can't be blank`);
      assert.equal(Object.keys(transformed).length, 5);
      assert.equal(transformed._id, note._id);
      assert.equal(transformed.note, note.note);
      assert.equal(transformed.type, 'note');
      assert(!transformed.userId);
      assert.deepEqual(noteCopy, note);
      done();
    });
  });

  it('should fail if plantIds is empty', (done) => {
    const note = {
      _id: '0e55d91cb33d420024432d67a3c7fb36',
      date: new Date(),
      plantIds: [],
      note: 'some text',
      type: 'note',
      userId: '9ec5c8ffcf885bf372488977ae0d6476',
    };
    const noteCopy = _.clone(note);

    const isNew = false;

    noteValidator(note, {isNew}, (err, transformed) => {
      // debug('err:', err);
      // debug('transformed:', transformed);

      assert(err);
      assert.equal(err.plantIds, `Plant ids must have at least 1 on plant associated`);
      assert.equal(Object.keys(transformed).length, 6);
      assert.equal(transformed._id, note._id);
      assert.equal(transformed.note, note.note);
      assert.equal(transformed.type, 'note');
      assert.equal(transformed.userId, note.userId);
      assert.deepEqual(noteCopy, note);
      done();
    });
  });

  it('should fail if plantIds is missing', (done) => {
    const note = {
      _id: '0e55d91cb33d420024432d67a3c7fb36',
      date: new Date(),
      note: 'some text',
      type: 'note',
      userId: '9ec5c8ffcf885bf372488977ae0d6476',
    };
    const noteCopy = _.clone(note);

    const isNew = false;

    noteValidator(note, {isNew}, (err, transformed) => {
      // debug('err:', err);
      // debug('transformed:', transformed);

      assert(err);
      assert.equal(err.plantIds, `Plant ids must be an array`);
      assert.equal(Object.keys(transformed).length, 5);
      assert.equal(transformed._id, note._id);
      assert.equal(transformed.note, note.note);
      assert.equal(transformed.type, 'note');
      assert.equal(transformed.userId, note.userId);
      assert.deepEqual(noteCopy, note);
      done();
    });
  });


});
