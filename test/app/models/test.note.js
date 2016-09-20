import _ from 'lodash';
import validators from '../../../app/models';
import constants from '../../../app/libs/constants';
import * as utils from '../../../app/libs/utils';
import assert from 'assert';

const {makeMongoId} = utils;
const noteValidator = validators.note;

// const logger = require('../../../lib/logging/logger').create('test.model-note');

describe('/app/models/note', function() {

  it('should pass minimum validation', (done) => {
    const note = {
      _id: makeMongoId(),
      date: new Date(),
      plantIds: [makeMongoId()],
      note: 'some text',
      userId: makeMongoId(),
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
      _id: '0e55d91cb33d42', // Not a MongoId
      date: 'Note a Date',
      plantIds: ['9ec5c8ffcf885bf'], // Not a MongoId in array
      note: {}, // not a string
      userId: '9ec5c8ffcf88',  // Not a MongoId
    };

    const noteCopy = _.clone(note);

    const isNew = false;

    noteValidator(note, {isNew}, (err /*, transformed*/) => {
      assert(err);

      assert.equal(err._id, ' id is invalid');
      assert.equal(err.date, 'Date must be a valid date');
      assert.equal(err.plantIds, 'Plant ids must be MongoIds');
      assert.equal(err.note, 'Note can\'t be blank');
      assert.equal(err.userId, 'User id is invalid');
      assert.deepEqual(noteCopy, note);
      done();
    });
  });

  it('should strip out props not in the schema', (done) => {
    const note = {
      _id: makeMongoId(),
      date: new Date(),
      plantIds: [makeMongoId()],
      note: 'some text',
      userId: makeMongoId(),
      fakeName1: 'Common Name',
      fakeName2: 'Description',
      plantId: 'fake plant id',
    };
    const noteCopy = _.clone(note);

    const isNew = false;

    noteValidator(note, {isNew}, (err, transformed) => {

      assert(!err);
      assert.equal(Object.keys(transformed).length, 5);
      assert.equal(transformed._id, note._id);
      assert.equal(transformed.note, note.note);
      assert.equal(transformed.userId, note.userId);
      assert(!transformed.fakeName1);
      assert(!transformed.fakeName2);
      assert(!transformed.plantId);
      assert.deepEqual(noteCopy, note);
      done();
    });
  });

  it('should add _id if it is a new record', (done) => {
    const note = {
      date: new Date(),
      plantIds: [makeMongoId()],
      note: 'some text',
      userId: makeMongoId(),
    };
    const noteCopy = _.clone(note);

    const isNew = true;
    noteValidator(note, {isNew}, (err, transformed) => {

      assert(!err);
      assert.equal(Object.keys(transformed).length, 5);
      assert(transformed._id);
      assert(constants.mongoIdRE.test(transformed._id));
      assert.equal(transformed.note, note.note);
      assert.equal(transformed.userId, note.userId);
      assert.equal(transformed.plantIds, note.plantIds);
      assert.deepEqual(noteCopy, note);
      done();
    });
  });

  it('should fail if userId is missing', (done) => {
    const note = {
      _id: makeMongoId(),
      date: new Date(),
      plantIds: [makeMongoId()],
      note: 'some text',
    };
    const noteCopy = _.clone(note);

    const isNew = false;

    noteValidator(note, {isNew}, (err, transformed) => {

      assert(err);
      assert.equal(err.userId, 'User id can\'t be blank');
      assert.equal(Object.keys(transformed).length, 4);
      assert.equal(transformed._id, note._id);
      assert.equal(transformed.note, note.note);
      assert(!transformed.userId);
      assert.deepEqual(noteCopy, note);
      done();
    });
  });

  it('should fail if plantIds is empty', (done) => {
    const note = {
      _id: makeMongoId(),
      date: new Date(),
      plantIds: [],
      note: 'some text',
      userId: makeMongoId(),
    };
    const noteCopy = _.clone(note);

    const isNew = false;

    noteValidator(note, {isNew}, (err, transformed) => {

      assert(err);
      assert.equal(err.plantIds, 'Plant ids must have at least 1 on plant associated');
      assert.equal(Object.keys(transformed).length, 5);
      assert.equal(transformed._id, note._id);
      assert.equal(transformed.note, note.note);
      assert.equal(transformed.userId, note.userId);
      assert.deepEqual(noteCopy, note);
      done();
    });
  });

  it('should fail if plantIds is missing', (done) => {
    const note = {
      _id: makeMongoId(),
      date: new Date(),
      note: 'some text',
      userId: makeMongoId(),
    };
    const noteCopy = _.clone(note);

    const isNew = false;

    noteValidator(note, {isNew}, (err, transformed) => {

      assert(err);
      assert.equal(err.plantIds, 'Plant ids is required');
      assert.equal(Object.keys(transformed).length, 4);
      assert.equal(transformed._id, note._id);
      assert.equal(transformed.note, note.note);
      assert.equal(transformed.userId, note.userId);
      assert.deepEqual(noteCopy, note);
      done();
    });
  });

  it('should fail if plantIds is not an array', (done) => {
    const note = {
      _id: makeMongoId(),
      date: new Date(),
      note: 'some text',
      plantIds: makeMongoId(),
      userId: makeMongoId(),
    };
    const noteCopy = _.clone(note);

    const isNew = false;

    noteValidator(note, {isNew}, (err, transformed) => {

      assert(err);
      assert.equal(err.plantIds, 'Plant ids must be an array');
      assert.equal(Object.keys(transformed).length, 5);
      assert.equal(transformed._id, note._id);
      assert.equal(transformed.note, note.note);
      assert.equal(transformed.userId, note.userId);
      assert.deepEqual(noteCopy, note);
      done();
    });
  });

  describe('note.model/images validation', () => {
    const image = {
      ext: 'jpg',
      id: makeMongoId(),
      originalname: 'apple tree',
      size: 123456
    };

    it('should pass with an empty images array', (done) => {
      const note = {
        _id: makeMongoId(),
        date: new Date(),
        images: [],
        note: 'some text',
        plantIds: [makeMongoId()],
        userId: makeMongoId(),
      };
      const noteCopy = _.clone(note);

      const isNew = false;

      noteValidator(note, {isNew}, (err, transformed) => {

        assert.equal(Object.keys(transformed).length, 6);
        assert.equal(transformed._id, note._id);
        assert.equal(transformed.note, note.note);
        assert.equal(transformed.userId, note.userId);
        assert.deepEqual(noteCopy, note);
        done();
      });
    });

    it('should pass with valid images', (done) => {
      const note = {
        _id: makeMongoId(),
        date: new Date(),
        images: [image],
        note: 'some text',
        plantIds: [makeMongoId()],
        userId: makeMongoId(),
      };
      const noteCopy = _.clone(note);

      const isNew = false;

      noteValidator(note, {isNew}, (err, transformed) => {

        assert.equal(Object.keys(transformed).length, 6);
        assert.equal(transformed._id, note._id);
        assert.equal(transformed.note, note.note);
        assert.equal(transformed.userId, note.userId);
        assert.deepEqual(noteCopy, note);
        done();
      });
    });

    it('should fail if images is not an array', (done) => {
      const note = {
        _id: makeMongoId(),
        date: new Date(),
        images: makeMongoId(),
        note: 'some text',
        plantIds: [makeMongoId()],
        userId: makeMongoId(),
      };
      const noteCopy = _.clone(note);

      const isNew = false;

      noteValidator(note, {isNew}, (err, transformed) => {

        assert(err);
        assert.equal(err.images, 'Images must be an array');
        assert.equal(Object.keys(transformed).length, 6);
        assert.equal(transformed._id, note._id);
        assert.equal(transformed.note, note.note);
        assert.equal(transformed.userId, note.userId);
        assert.deepEqual(noteCopy, note);
        done();
      });
    });

    it('should fail if images id is not a mongoId', (done) => {
      const note = {
        _id: makeMongoId(),
        date: new Date(),
        images: [{...image, id: 123}],
        note: 'some text',
        plantIds: [makeMongoId()],
        userId: makeMongoId(),
      };
      const noteCopy = _.clone(note);

      const isNew = false;

      noteValidator(note, {isNew}, (err, transformed) => {

        assert(err);
        assert.equal(err.images, 'Images must be valid image objects');
        assert.equal(Object.keys(transformed).length, 6);
        assert.equal(transformed._id, note._id);
        assert.equal(transformed.note, note.note);
        assert.equal(transformed.userId, note.userId);
        assert.deepEqual(noteCopy, note);
        done();
      });
    });

    it('should fail if images ext is not a string', (done) => {
      const note = {
        _id: makeMongoId(),
        date: new Date(),
        images: [{...image, ext: 123}],
        note: 'some text',
        plantIds: [makeMongoId()],
        userId: makeMongoId(),
      };
      const noteCopy = _.clone(note);

      const isNew = false;

      noteValidator(note, {isNew}, (err, transformed) => {

        assert(err);
        assert.equal(err.images, 'Images must be valid image objects');
        assert.equal(Object.keys(transformed).length, 6);
        assert.equal(transformed._id, note._id);
        assert.equal(transformed.note, note.note);
        assert.equal(transformed.userId, note.userId);
        assert.deepEqual(noteCopy, note);
        done();
      });
    });

    it('should fail if images originalname is not a string', (done) => {
      const note = {
        _id: makeMongoId(),
        date: new Date(),
        images: [{...image, originalname: 123}],
        note: 'some text',
        plantIds: [makeMongoId()],
        userId: makeMongoId(),
      };
      const noteCopy = _.clone(note);

      const isNew = false;

      noteValidator(note, {isNew}, (err, transformed) => {

        assert(err);
        assert.equal(err.images, 'Images must be valid image objects');
        assert.equal(Object.keys(transformed).length, 6);
        assert.equal(transformed._id, note._id);
        assert.equal(transformed.note, note.note);
        assert.equal(transformed.userId, note.userId);
        assert.deepEqual(noteCopy, note);
        done();
      });
    });

    it('should convert image size if it is a string number', (done) => {
      const note = {
        _id: makeMongoId(),
        date: new Date(),
        images: [{...image, size: '123'}],
        note: 'some text',
        plantIds: [makeMongoId()],
        userId: makeMongoId(),
      };
      const noteCopy = _.clone(note);

      const isNew = false;

      noteValidator(note, {isNew}, (err, transformed) => {
        assert(!err);
        assert.equal(Object.keys(transformed).length, 6);
        assert.equal(transformed._id, note._id);
        assert.equal(transformed.note, note.note);
        assert.equal(transformed.userId, note.userId);
        assert.equal(transformed.images[0].size, 123);
        assert.deepEqual(noteCopy, note);
        done();
      });
    });

    it('should fail if images ext is longer than 20', (done) => {
      const note = {
        _id: makeMongoId(),
        date: new Date(),
        images: [{...image, ext: '123456789012345678901'}],
        note: 'some text',
        plantIds: [makeMongoId()],
        userId: makeMongoId(),
      };
      const noteCopy = _.clone(note);

      const isNew = false;

      noteValidator(note, {isNew}, (err, transformed) => {

        assert(err);
        assert.equal(err.images, 'Images must be valid image objects');
        assert.equal(Object.keys(transformed).length, 6);
        assert.equal(transformed._id, note._id);
        assert.equal(transformed.note, note.note);
        assert.equal(transformed.userId, note.userId);
        assert.deepEqual(noteCopy, note);
        done();
      });
    });

    it('should fail if images has extra props', (done) => {
      const note = {
        _id: makeMongoId(),
        date: new Date(),
        images: [{...image, extra: 'jpg'}],
        note: 'some text',
        plantIds: [makeMongoId()],
        userId: makeMongoId(),
      };
      const noteCopy = _.clone(note);

      const isNew = false;

      noteValidator(note, {isNew}, (err, transformed) => {
        assert(err);
        assert.equal(err.images, 'Images must only have the following allowed props: id,ext,originalname,size,sizes and found these props as well: extra');
        assert.equal(Object.keys(transformed).length, 6);
        assert.equal(transformed._id, note._id);
        assert.equal(transformed.note, note.note);
        assert.equal(transformed.userId, note.userId);
        assert.deepEqual(noteCopy, note);
        done();
      });
    });

  });

});
