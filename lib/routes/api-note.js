import {requireToken} from '../config/token-check';
import async from 'async';
import aws from 'aws-sdk';
import constants from '../../app/libs/constants';
import mongo from '../db/mongo';
import multer from 'multer';
import validators from '../../app/models';
import * as utils from '../../app/libs/utils';

const logger = require('../logging/logger').create('api-note');

const {
  note: validateNote
} = validators;

export default (app) => {

  // Note CRUD operations
  // Note Create
  app.post('/api/note', requireToken, (req, res) => {

    req.body.userId = req.user._id;
    logger.trace('POST /api/note user', {'req.body': req.body, userId: req.body.userId});
    const isNew = true;

    validateNote(req.body, {isNew}, (validateNoteError, transformed) => {
      if(validateNoteError) {
        logger.security('POST /api/note validateNote', {validateNoteError}, {body: req.body}, {isNew});
        return res.status(400).send(validateNoteError);
      }
      logger.trace('/api/note transformed:', transformed);
      mongo.createNote(transformed, (createNoteError, result) => {
        if(createNoteError) {
          logger.error('POST /api/note createNote', {createNoteError}, {transformed}, {result});
          return res.status(500).send('Error creating note. Check Logs');
        }
        return res.status(200).send({success: true, note: transformed});
      });
    });
  });

  // Note Read Multiple
  app.post('/api/notes', (req, res) => {
    logger.trace('/api/notes body', {body: req.body});
    const {noteIds} = req.body;
    if(!noteIds || !noteIds.length) {
      logger.error('No ids in POST /api/notes', {noteIds});
      return res.status(404).send('No noteIds in body request');
    }
    mongo.getNotesByIds(noteIds, (getNotesByIdsErr, notes) => {
      if(getNotesByIdsErr) {
        return res.status(500).send('Error getting notes');
      }
      logger.trace('responding with notes:', {notes});
      return res.send(notes);
    });
  });

  // Note Update
  app.put('/api/note', requireToken, (req, res) => {
    req.body.userId = req.user._id;
    const isNew = false;

    validateNote(req.body, {isNew}, (validateNoteError, transformed) => {
      if(validateNoteError) {
        logger.error('PUT /api/note validateNote', {validateNoteError}, {body: req.body, 'images': req.body.images}, {isNew});
        return res.status(400).send(validateNoteError);
      }

      mongo.updateNote(transformed, (updateNoteError, result) => {
        if(updateNoteError) {
          logger.error('PUT /api/note updateNote', {updateNoteError}, {transformed}, {result});
          return res.status(updateNoteError.statusCode || 500).send(updateNoteError);
        }
        return res.status(200).send({success: true, note: transformed});
      });
    });
  });

  const firstDirectory = process.env.NODE_ENV === 'production' ? 'up' : 'test';
  // The image is the object stored in the images array in the note.
  function makeS3KeyFromImage(image, size = 'orig') {
    return `${firstDirectory}/${size}/${image.id}${image.ext && '.'}${image.ext}`;
  }

  function makeS3KeysFromImages(images) {
    return ['orig', 'xl', 'lg', 'md', 'sm', 'thumb'].reduce((acc, size) => {
      acc = acc.concat(images.map(image => {
        return {Key: makeS3KeyFromImage(image, size)};
      }));
      return acc;
    }, []);
  }

  // Note Delete
  app.delete('/api/note/:noteId', requireToken, (req, res) => {

    const {params = {}} = req;
    const {noteId} = params;

    if(!noteId) {
      logger.error('DELETE /api/note/:noteId missing noteId', {params});
      return res.status(403).send({error: 'Missing noteId'});
    }

    const userId = req.user._id;

    function getNote(cb) {
      mongo.getNoteById(noteId, (getNoteByIdError, note) => {
        if(getNoteByIdError) {
          logger.error('Error getting note before note delete', {getNoteByIdError});
        } else {
          if(note.userId !== userId) {
            logger.security('Non-owner trying to delete note', {note, userId});
            return cb(true);
          }
        }
        cb(getNoteByIdError, note);
      });
    }

    function deleteImages(note, cb) {
      if(note && note.images && note.images.length) {
        const s3 = new aws.S3();

        const options = {
          // TODO: Will need to do this for each bucket once we start resizing them.
          Bucket: constants.awsBucketName,
          Delete: {
            Objects: makeS3KeysFromImages(note.images)
          }
        };

        logger.trace('#1 About to delete S3 images', {images: note.images});
        logger.trace('#2 About to delete S3 images', {Delete: options.Delete.Objects});

        s3.deleteObjects(options, (s3DeleteObjectsError, data) => {
          logger.trace('results from s3 delete', {s3DeleteObjectsError, firstDeleted: data.Deleted[0]});
          if(s3DeleteObjectsError) {
            logger.error('Error deleting s3 objects', {s3DeleteObjectsError, options, note});
          }
          cb(s3DeleteObjectsError, note);
        });
      } else {
        cb(null, note);
      }
    }

    function deleteNote(/* note */) {
      mongo.deleteNote(noteId, userId, (deleteNoteError, result) => {
        if(deleteNoteError) {
          logger.error('DELETE /api/note deleteNote', {deleteNoteError}, {params}, {result});
          return res.status(deleteNoteError.statusCode || 500).send('Error deleting note. See Logs');
        } else {
          if(result) {
            return res.status(200).send({success: true});
          }
          logger.warn('Note not found in DELETE /api/note deleteNote', {params});
          return res.status(404).send({message: 'Not Found'});
        }
      });
    }

    async.waterfall([getNote, deleteImages, deleteNote]);

  });


  // #1
  /*
  file param looks like:
  {
    fieldname: 'file',
    originalname: '2016-08-27 10.22.00.jpg',
    encoding: '7bit',
    mimetype: 'image/jpeg'
  }
  */
  function fileFilter(req, file, cb) {
    // logger.trace('multer.fileFilter()', {file}, {'req.body': req.body});
    const acceptFile = (file.mimetype || '').toLowerCase().startsWith('image/');
    if(!acceptFile) {
      logger.info('Rejecting file because not correct mimetype', {file});
    }
    cb(null, acceptFile);
  }

  var storage = multer.memoryStorage();
  const upload = multer({fileFilter, storage});

  // file:
  // {fieldname: 'file', originalname: '2016-08-28 08.54.26.jpg', encoding: '7bit', mimetype: 'image/jpeg', buffer: ..., size: 3916869 }
  function createFileFromMulterObject(file) {
    const {originalname: original = '', size} = file;
    const parts = original.toLowerCase().split('.');
    const ext = parts.length > 1 ? parts[parts.length - 1] : '';
    const id = utils.makeMongoId();
    const snip = ext && ext.length > 0 ? ext.length + 1 : 0;
    const originalname = original.slice(0, -snip);
    return {
      noteFile: {id, ext, originalname, size},
      multerFile: file
    };
  }

  // data:
  // {files, userid}
  function uploadImages(data, cb) {
    // export AWS_ACCESS_KEY_ID='AKID'
    // export AWS_SECRET_ACCESS_KEY='SECRET'
    const s3 = new aws.S3();
    async.each(data.files, (file, next) => {
      const Metadata = {
        userid: data.userid,
        noteid: data.noteid,
        originalname: file.noteFile.originalname,
        id: file.noteFile.id
      };
      const params = {
        Bucket: constants.awsBucketName,
        ContentType: file.multerFile.mimetype,
        Key: makeS3KeyFromImage(file.noteFile),
        Metadata,
        Body: file.multerFile.buffer
      };
      logger.trace('About to upload to s3', {params}, {Metadata});
      s3.putObject(params, (putObjectError) => {
        logger.trace('s3.putObject results', {putObjectError});
        next(putObjectError);
      });
    }, cb);
  }

  function imageNote(req, res) {
    // req.body: {
    //   note: '{"date":"09/13/2016","note":"ggggg","plantIds":["57cf7efb7157df0000d81f14"],"userId":"57c74b40a901d8113f7db602","_id":"57d898a2d9ef2e000099f4da"}' }
    // req.files: [
    //   {fieldname: 'file', originalname: '2016-08-28 08.54.26.jpg', encoding: '7bit', mimetype: 'image/jpeg', buffer: ..., size: 3916869 },
    //   {fieldname: 'file', originalname: '57cf46f4b3deaa59f748927e.jpg', encoding: '7bit', mimetype: 'image/jpeg', buffer: ..., size: 2718943 }
    //   ]}

    // 1. Upsert note in db
    // 2. Push files to S3
    logger.trace('imageNote', {'req.body': req.body, 'req.files': req.files});
    if(!req.body.note) {
      logger.error('Missing note in body on image upload', {'req.body': req.body});
      return res.status(500).send({success: false, message: 'Failed to find note in body'});
    }
    let note;
    try {
      note = JSON.parse(req.body.note);
    } catch(jsonParseError) {
      logger.error('Error when parsing note from body in image upload', {jsonParseError}, {'req.body': req.body});
      return res.status(500).send({success: false, message: 'Failed to parse note from body'});
    }
    note.userId = req.user._id;
    const noteid = note._id.toString();

    const files = (req.files || []).map(file => createFileFromMulterObject(file));
    note.images = (note.images || []).concat(files.map(file => file.noteFile));

    logger.trace('note with images', {note});

    mongo.upsertNote(note, (upsertNoteError, updateNote) => {
      logger.trace('upsertNote result', {upsertNoteError, updateNote});
      req.note = note;
      if(upsertNoteError) {
        logger.error('mongo.upsertNote in imageNote', {upsertNoteError});
        return res.status(500).send({success: false, message: 'Failed to save note to DB'});
      } else {
        const data = {
          files,
          userid: req.user._id,
          noteid
        };
        uploadImages(data, (uploadImagesError) => {
          if(uploadImagesError) {
            return res.status(500).send({success: false, message: 'Failed to upload images to S3'});
          } else {
            return res.status(200).send({success: true, note});
          }
        });
      }
    });
  }

  app.post('/api/upload', requireToken, upload.array('file', constants.maxImageFilesPerUpload), imageNote);

  const imageCompleteToken = process.env.PLANT_IMAGE_COMPLETE;
  app.put('/api/image-complete', (req, res) => {
    logger.info('PUT /api/image-complete', {body: req.body});

    const {query = {}} = req;
    const {token} = query;
    if(!imageCompleteToken) {
      const message = 'PLANT_IMAGE_COMPLETE environment variable is not defined';
      logger.error(message);
      return res.send({success: false, message });
    }

    if(imageCompleteToken !== token) {
      const message = `Token mismatch: PLANT_IMAGE_COMPLETE=${imageCompleteToken} and token=${token}`;
      logger.error(message);
      return res.send({success: false, message });
    }

    const {
      metadata = {},
      sizes = []
    } = req.body || {};

    if(!sizes.length) {
      const message = `Unexpect length of sizes ${sizes.length}`;
      logger.error(message);
      return res.send({success: false, message});
    }

    const {
      noteid: _id,
      id: imageId,
      userid: userId
    } = metadata;

    // req.body:
    // {"metadata":{
    //   "userid":"57c74b40a901d8113f7db602",
    //   "id":"57d9f5536420d13e0e1e6a30",
    //   "noteid":"57d9f5536e7b1200005a99e7",
    //   "originalname":"princess grape..."
    // },"sizes":[
    //   {"width":100,"name":"thumb"},
    //   {"width":500,"name":"sm"},
    //   {"width":1000,"name":"md"},
    //   {"width":1500,"name":"lg"},
    //   {"width":2000,"name":"xl"}
    // ]}

    const noteUpdate = {
      _id,
      userId,
      imageId,
      sizes
    };

    mongo.addSizesToNoteImage(noteUpdate, (addSizesToNoteImageError) => {
      if(addSizesToNoteImageError) {
        // Error has already been logged in data layer
        return res.status(500).send({success: false, message: 'Error updating note'});
      }
      res.send({success: true});
    });
  });

};
